/**
 * cartController.js – Server-side cart management
 */
import db from '../db.js';

/**
 * GET /api/cart/:userId
 * Returns all cart items for a user, joined with product data
 */
export function getCart(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const items = db.prepare(`
      SELECT ci.id, ci.quantity, ci.product_id,
             p.name, p.price, p.image_url, p.stock,
             c.name AS category
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE ci.user_id = ?
      ORDER BY ci.id ASC
    `).all(userId);

        const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        res.json({
            items: items.map((i) => ({
                id: i.id,
                product_id: i.product_id,
                name: i.name,
                price: i.price,
                image_url: i.image_url,
                stock: i.stock,
                category: i.category,
                quantity: i.quantity,
            })),
            subtotal: Math.round(subtotal * 100) / 100,
            item_count: items.reduce((sum, i) => sum + i.quantity, 0),
        });
    } catch (err) {
        console.error('getCart error:', err);
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
}

/**
 * POST /api/cart
 * Body: { user_id, product_id, quantity }
 * Upserts: if item exists, increments quantity
 */
export function addToCart(req, res) {
    try {
        const { user_id = 1, product_id, quantity = 1 } = req.body;
        if (!product_id) return res.status(400).json({ error: 'product_id is required' });

        // Check product exists and is in stock
        const product = db.prepare('SELECT id, stock FROM products WHERE id = ?').get(product_id);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Upsert: insert or increment
        const existing = db.prepare(
            'SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?'
        ).get(user_id, product_id);

        if (existing) {
            const newQty = existing.quantity + quantity;
            if (newQty > product.stock) {
                return res.status(400).json({ error: 'Not enough stock' });
            }
            db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
        } else {
            if (quantity > product.stock) {
                return res.status(400).json({ error: 'Not enough stock' });
            }
            db.prepare(
                'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)'
            ).run(user_id, product_id, quantity);
        }

        res.status(201).json({ message: 'Added to cart' });
    } catch (err) {
        console.error('addToCart error:', err);
        res.status(500).json({ error: 'Failed to add to cart' });
    }
}

/**
 * PUT /api/cart/:itemId
 * Body: { quantity }
 */
export function updateCartItem(req, res) {
    try {
        const itemId = parseInt(req.params.itemId);
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json({ error: 'Quantity must be at least 1' });
        }

        const item = db.prepare(`
      SELECT ci.*, p.stock FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.id = ?
    `).get(itemId);

        if (!item) return res.status(404).json({ error: 'Cart item not found' });
        if (quantity > item.stock) return res.status(400).json({ error: 'Not enough stock' });

        db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, itemId);
        res.json({ message: 'Cart item updated' });
    } catch (err) {
        console.error('updateCartItem error:', err);
        res.status(500).json({ error: 'Failed to update cart item' });
    }
}

/**
 * DELETE /api/cart/:itemId
 */
export function deleteCartItem(req, res) {
    try {
        const itemId = parseInt(req.params.itemId);
        const result = db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Cart item not found' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (err) {
        console.error('deleteCartItem error:', err);
        res.status(500).json({ error: 'Failed to remove cart item' });
    }
}
