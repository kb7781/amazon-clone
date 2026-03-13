/**
 * routes/products.js – Product API routes
 */
import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';

const router = Router();

// GET /api/products?search=&category=&sort=
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

export default router;
