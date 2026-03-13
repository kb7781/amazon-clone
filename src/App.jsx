import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Home from './pages/Home/Home';
import ProductListing from './pages/ProductListing/ProductListing';
import ProductDetail from './pages/ProductDetail/ProductDetail';
import Cart from './pages/Cart/Cart';
import Auth from './pages/Auth/Auth';
import Checkout from './pages/Checkout/Checkout';
import OrderConfirmation from './pages/OrderConfirmation/OrderConfirmation';
import OrderHistory from './pages/OrderHistory/OrderHistory';
import Wishlist from './pages/Wishlist/Wishlist';
import { Suspense } from 'react';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eaeded]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-amazon border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Loading…</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <WishlistProvider>
          {/* Toast notifications – Amazon dark style */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 2500,
              style: {
                background: '#131921',
                color: '#fff',
                fontSize: '14px',
                borderRadius: '4px',
                padding: '10px 16px',
              },
              success: { iconTheme: { primary: '#FF9900', secondary: '#131921' } },
            }}
          />

          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Main pages */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/auth" element={<Auth />} />

              {/* Order flow */}
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
              <Route path="/orders" element={<OrderHistory />} />

              {/* 404 */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center flex-col gap-4 bg-[#eaeded]">
                  <h1 className="text-6xl font-bold text-gray-200">404</h1>
                  <p className="text-gray-600 text-lg">Page not found.</p>
                  <a href="/" className="btn-amazon-primary px-8 py-2.5">Go Home</a>
                </div>
              } />
            </Routes>
          </Suspense>
        </WishlistProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
