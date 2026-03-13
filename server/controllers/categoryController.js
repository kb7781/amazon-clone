/**
 * categoryController.js – Business logic for categories
 */
import db from '../db.js';

/**
 * GET /api/categories
 */
export function getCategories(_req, res) {
    try {
        const categories = db.prepare('SELECT * FROM categories ORDER BY id').all();
        res.json(categories);
    } catch (err) {
        console.error('getCategories error:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}
