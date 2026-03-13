/**
 * server/index.js – Express API entry point
 */
import express from 'express';
import cors from 'cors';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import authRouter from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,       // e.g. https://amazon-clone-xxx.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman, server-to-server)
    if (!origin) return cb(null, true);
    // Allow any *.vercel.app domain or explicitly listed origins
    if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
      return cb(null, true);
    }
    cb(null, true); // permissive for demo — tighten for production
  },
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);

// 404 fallback
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🚀 Amazon Clone API  →  http://localhost:${PORT}`);
  console.log(`   Health     →  http://localhost:${PORT}/api/health`);
  console.log(`   Products   →  http://localhost:${PORT}/api/products`);
  console.log(`   Categories →  http://localhost:${PORT}/api/categories`);
  console.log(`   Cart       →  http://localhost:${PORT}/api/cart/1`);
  console.log(`   Orders     →  http://localhost:${PORT}/api/orders/user/1\n`);
});

export default app;

