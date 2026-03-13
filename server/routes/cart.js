/**
 * routes/cart.js – Shopping cart API routes
 */
import { Router } from 'express';
import { getCart, addToCart, updateCartItem, deleteCartItem } from '../controllers/cartController.js';

const router = Router();

// GET    /api/cart/:userId   → Get user's cart
router.get('/:userId', getCart);

// POST   /api/cart           → Add item to cart
router.post('/', addToCart);

// PUT    /api/cart/:itemId   → Update item quantity
router.put('/:itemId', updateCartItem);

// DELETE /api/cart/:itemId   → Remove item from cart
router.delete('/:itemId', deleteCartItem);

export default router;
