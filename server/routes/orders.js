/**
 * routes/orders.js – Order API routes
 */
import { Router } from 'express';
import { createOrder, getUserOrders, getOrderById, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

// POST   /api/orders         → Place a new order
router.post('/', createOrder);

// GET    /api/orders/user/:userId → Get all orders for a user
router.get('/user/:userId', getUserOrders);

// GET    /api/orders/:id     → Get single order
router.get('/:id', getOrderById);

// PATCH  /api/orders/:id/status → Update order status
router.patch('/:id/status', updateOrderStatus);

export default router;
