/**
 * api.js – Frontend API service
 * All calls go to local Express backend only (no FakeStore fallback).
 */
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 60000,
});

// Default user ID (always logged in)
const USER_ID = 1;

// ─── Products ──────────────────────────────────────────────

/** Fetch products with optional search, category, and sort */
export const fetchProducts = async ({ search, category, sort, limit } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (category) params.category = category;
  if (sort) params.sort = sort;
  if (limit) params.limit = limit;
  const res = await api.get('/products', { params });
  return res.data;
};

/** Fetch a single product by ID (includes gallery images) */
export const fetchProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

// ─── Categories ────────────────────────────────────────────

/** Fetch all categories */
export const fetchCategories = async () => {
  const res = await api.get('/categories');
  return res.data;
};

// ─── Cart ──────────────────────────────────────────────────

/** Get user's cart */
export const fetchCart = async () => {
  const res = await api.get(`/cart/${USER_ID}`);
  return res.data;
};

/** Add item to cart */
export const addToCartAPI = async (product_id, quantity = 1) => {
  const res = await api.post('/cart', { user_id: USER_ID, product_id, quantity });
  return res.data;
};

/** Update cart item quantity */
export const updateCartItemAPI = async (itemId, quantity) => {
  const res = await api.put(`/cart/${itemId}`, { quantity });
  return res.data;
};

/** Remove item from cart */
export const removeCartItemAPI = async (itemId) => {
  const res = await api.delete(`/cart/${itemId}`);
  return res.data;
};

// ─── Orders ────────────────────────────────────────────────

/** Place an order */
export const placeOrder = async ({ shipping_address, items }) => {
  const res = await api.post('/orders', {
    user_id: USER_ID,
    shipping_address,
    items: items.map((i) => ({
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
    })),
  });
  return res.data;
};

/** Fetch all orders for the default user */
export const fetchOrders = async () => {
  const res = await api.get(`/orders/user/${USER_ID}`);
  return res.data;
};

/** Fetch a single order by ID */
export const fetchOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

/** Update order status */
export const updateOrderStatus = async (id, status) => {
  const res = await api.patch(`/orders/${id}/status`, { status });
  return res.data;
};

// ─── Auth (Bonus Feature) ──────────────────────────────────

/** Register a new user */
export const registerUser = async (payload) => {
  const res = await api.post('/auth/register', payload);
  return res.data;
};

/** Login */
export const loginUser = async (payload) => {
  const res = await api.post('/auth/login', payload);
  return res.data;
};

export default api;
