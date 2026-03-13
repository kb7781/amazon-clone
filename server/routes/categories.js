/**
 * routes/categories.js – Category API routes
 */
import { Router } from 'express';
import { getCategories } from '../controllers/categoryController.js';

const router = Router();

// GET /api/categories
router.get('/', getCategories);

export default router;
