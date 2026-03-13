/**
 * productController.js – Business logic for product-related operations
 */
import db from '../db.js';

/**
 * GET /api/products?search=&category=&sort=
 */
export function getProducts(req, res) {
    try {
        const { search, category, sort, limit = 100 } = req.query;
        let sql = `
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;
        const params = [];

        if (search) {
            sql += ' AND (LOWER(p.name) LIKE ? OR LOWER(p.description) LIKE ?)';
            const q = `%${search.toLowerCase()}%`;
            params.push(q, q);
        }

        if (category) {
            sql += ' AND p.category_id = ?';
            params.push(parseInt(category));
        }

        // Sorting
        switch (sort) {
            case 'price_asc':
                sql += ' ORDER BY p.price ASC';
                break;
            case 'price_desc':
                sql += ' ORDER BY p.price DESC';
                break;
            case 'rating':
                sql += ' ORDER BY p.rating DESC';
                break;
            case 'newest':
                sql += ' ORDER BY p.created_at DESC';
                break;
            default:
                sql += ' ORDER BY p.id ASC';
        }

        sql += ' LIMIT ?';
        params.push(parseInt(limit));

        const products = db.prepare(sql).all(...params).map(formatProduct);
        res.json(products);
    } catch (err) {
        console.error('getProducts error:', err);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

/**
 * GET /api/products/:id
 */
export function getProductById(req, res) {
    try {
        const row = db.prepare(`
      SELECT p.*, c.name AS category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(req.params.id);

        if (!row) return res.status(404).json({ error: 'Product not found' });

        const product = formatProduct(row);

        // Attach gallery images
        product.images = db
            .prepare('SELECT id, image_url FROM product_images WHERE product_id = ?')
            .all(row.id)
            .map((img) => img.image_url);

        res.json(product);
    } catch (err) {
        console.error('getProductById error:', err);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

/**
 * Format a raw DB row into the API response shape
 */
function formatProduct(row) {
    return {
        id: row.id,
        name: row.name,
        description: row.description,
        price: row.price,
        stock: row.stock,
        category_id: row.category_id,
        category: row.category_name,
        rating: row.rating,
        review_count: row.review_count,
        image_url: row.image_url,
    };
}
