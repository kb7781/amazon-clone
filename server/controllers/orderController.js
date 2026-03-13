/**
 * orderController.js – Business logic for orders
 */
import db from '../db.js';

/**
 * POST /api/orders
 * Body: { user_id, shipping_address, items: [{ product_id, quantity, price }] }
 */
export function createOrder(req, res) {
    try {
        const { user_id = 1, shipping_address, items } = req.body;

        if (!shipping_address) {
            return res.status(400).json({ error: 'Shipping address is required' });
        }
        if (!items || !items.length) {
            return res.status(400).json({ error: 'Order must have at least one item' });
        }

        // Calculate total from items
        const total_amount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

        const result = db.transaction(() => {
            // Create order
            const orderResult = db.prepare(`
        INSERT INTO orders (user_id, total_amount, shipping_address, status)
        VALUES (?, ?, ?, 'Placed')
      `).run(user_id, Math.round(total_amount * 100) / 100, JSON.stringify(shipping_address));

            const orderId = orderResult.lastInsertRowid;

            // Insert order items
            const insertItem = db.prepare(`
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES (?, ?, ?, ?)
      `);
            for (const item of items) {
                insertItem.run(orderId, item.product_id, item.quantity, item.price);
            }

            // Clear user's cart after placing order
            db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(user_id);

            return orderId;
        })();

        // Fetch the created order
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result);
        const orderItems = db.prepare(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(result);

        res.status(201).json({
            orderId: result,
            order: {
                ...order,
                shipping_address: JSON.parse(order.shipping_address),
            },
            items: orderItems,
        });
    } catch (err) {
        console.error('createOrder error:', err);
        res.status(500).json({ error: 'Failed to place order' });
    }
}

/**
 * GET /api/orders/user/:userId
 */
export function getUserOrders(req, res) {
    try {
        const userId = parseInt(req.params.userId);
        const orders = db.prepare(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC'
        ).all(userId);

        const result = orders.map((o) => {
            const items = db.prepare(`
        SELECT oi.*, p.name, p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `).all(o.id);

            return {
                ...o,
                shipping_address: (() => { try { return JSON.parse(o.shipping_address); } catch { return o.shipping_address; } })(),
                items,
            };
        });

        res.json(result);
    } catch (err) {
        console.error('getUserOrders error:', err);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
}

/**
 * GET /api/orders/:id (single order)
 */
export function getOrderById(req, res) {
    try {
        const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
        if (!order) return res.status(404).json({ error: 'Order not found' });

        const items = db.prepare(`
      SELECT oi.*, p.name, p.image_url
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `).all(order.id);

        res.json({
            ...order,
            shipping_address: (() => { try { return JSON.parse(order.shipping_address); } catch { return order.shipping_address; } })(),
            items,
        });
    } catch (err) {
        console.error('getOrderById error:', err);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
}
