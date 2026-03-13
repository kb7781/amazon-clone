import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';

function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart();

  return (
    <div className="flex gap-4 p-4 border-b border-gray-200 last:border-b-0">
      {/* Image */}
      <Link to={`/products/${item.product_id}`} className="flex-shrink-0 w-24 h-24 flex items-center justify-center border border-gray-200 rounded p-2">
        <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link to={`/products/${item.product_id}`}>
          <h3 className="font-medium text-gray-900 text-sm hover:text-amazon line-clamp-2 mb-1">{item.name}</h3>
        </Link>
        <p className="text-green-700 text-xs font-semibold mb-1">In Stock</p>
        <p className="text-xs text-blue-700 mb-2">✓ FREE Delivery</p>

        {/* Qty controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-gray-300 rounded overflow-hidden">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Decrease"
            >
              <FiMinus size={12} />
            </button>
            <span className="px-3 py-1 text-sm font-medium border-x border-gray-300">{item.quantity}</span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Increase"
            >
              <FiPlus size={12} />
            </button>
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-blue-600 hover:text-red-600 text-xs hover:underline flex items-center gap-1 transition-colors"
          >
            <FiTrash2 size={13} /> Delete
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  );
}

export default function Cart() {
  const { cartItems, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  const shippingFee = cartTotal > 4999 ? 0 : 99;
  const tax = cartTotal * 0.08;
  const orderTotal = cartTotal + shippingFee + tax;

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-3 py-4">
        <div className="flex gap-4 items-start flex-col lg:flex-row">
          {/* ── Cart items ── */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded shadow-sm">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex justify-between items-end">
                <div>
                  <h1 className="text-2xl font-medium">Shopping Cart</h1>
                  <p className="text-xs text-gray-500">{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
                </div>
                <p className="text-sm text-gray-500 hidden sm:block">Price</p>
              </div>

              {/* Items or empty */}
              {cartItems.length === 0 ? (
                <div className="p-12 text-center">
                  <FiShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
                  <h2 className="text-xl font-medium text-gray-700 mb-2">Your Amazon Cart is empty</h2>
                  <p className="text-gray-500 text-sm mb-6">Shop today's deals</p>
                  <Link to="/" className="btn-amazon-primary px-8 py-2.5">
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <>
                  {cartItems.map((item) => <CartItem key={item.id} item={item} />)}
                  <div className="p-4 text-right border-t border-gray-200">
                    <p className="text-lg font-medium">
                      Subtotal ({cartCount} items):{' '}
                      <span className="font-bold">₹{cartTotal.toFixed(2)}</span>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* ── Order summary ── */}
          {cartItems.length > 0 && (
            <div className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded shadow-sm p-6 sticky top-24">
                <h2 className="font-bold text-lg mb-4">Order Summary</h2>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cartCount} items)</span>
                    <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className={shippingFee === 0 ? 'text-green-700 font-medium' : ''}>
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Estimated Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <hr className="border-gray-200 mb-4" />

                <div className="flex justify-between font-bold text-lg mb-5">
                  <span>Order Total</span>
                  <span>₹{orderTotal.toFixed(2)}</span>
                </div>

                {shippingFee === 0 && (
                  <p className="text-green-700 text-xs mb-3 font-medium">✓ Your order qualifies for FREE Shipping</p>
                )}

                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-amazon-primary w-full py-3 text-base"
                >
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-500 mt-3 text-center">🔒 Secure checkout</p>

                <Link
                  to="/"
                  className="block text-center text-blue-600 hover:underline text-sm mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
