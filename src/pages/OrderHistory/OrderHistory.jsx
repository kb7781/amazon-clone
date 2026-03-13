import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchOrders } from '../../services/api';
import { FiPackage, FiChevronRight, FiShoppingBag } from 'react-icons/fi';

const STATUS_COLORS = {
  Placed: 'bg-yellow-100 text-yellow-700',
  Processing: 'bg-yellow-100 text-yellow-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

function OrderCard({ order }) {
  const status = order.status || 'Placed';
  const date = new Date(order.created_at).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const items = order.items || [];

  return (
    <div className="bg-white rounded shadow-sm overflow-hidden">
      {/* Header bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-6 text-xs text-gray-500">
          <div>
            <p className="uppercase tracking-wide font-semibold mb-0.5">Order Placed</p>
            <p className="text-gray-900 font-medium">{date}</p>
          </div>
          <div>
            <p className="uppercase tracking-wide font-semibold mb-0.5">Total</p>
            <p className="text-gray-900 font-medium">₹{Number(order.total_amount).toFixed(2)}</p>
          </div>
          <div>
            <p className="uppercase tracking-wide font-semibold mb-0.5">Status</p>
            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || STATUS_COLORS.Placed}`}>
              {status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400 uppercase tracking-wide">Order ID</p>
          <p className="text-xs font-mono font-bold text-amazon">{order.id}</p>
        </div>
      </div>

      {/* Items */}
      <div className="p-4">
        <div className="flex gap-3 mb-3 flex-wrap">
          {items.slice(0, 4).map((item, i) => (
            <div key={i} className="w-16 h-16 bg-gray-50 border border-gray-200 rounded p-1 flex items-center justify-center flex-shrink-0">
              {item.image_url
                ? <img src={item.image_url} alt={item.name} className="max-h-full max-w-full object-contain" />
                : <FiPackage className="text-gray-300" size={24} />
              }
            </div>
          ))}
          {items.length > 4 && (
            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-500 font-medium">
              +{items.length - 4}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <p className="text-sm text-gray-700 font-medium line-clamp-1">{items[0].name}{items.length > 1 ? ` and ${items.length - 1} more item${items.length > 2 ? 's' : ''}` : ''}</p>
        )}

        <div className="flex gap-3 mt-3">
          <Link
            to={`/order-confirmation/${order.id}`}
            className="text-sm text-blue-600 hover:underline flex items-center gap-1"
          >
            View Order Details <FiChevronRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then((data) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-3 py-5">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiShoppingBag className="text-amazon" /> Your Orders
          </h1>
          <Link to="/products" className="text-blue-600 hover:underline text-sm">Continue Shopping →</Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded shadow-sm p-6 space-y-3">
                <div className="skeleton-box h-4 w-1/3 rounded" />
                <div className="skeleton-box h-16 w-full rounded" />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded shadow-sm p-12 text-center">
            <FiShoppingBag className="mx-auto text-gray-200 mb-4" size={64} />
            <h2 className="text-xl font-medium text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-500 text-sm mb-6">When you place an order, it will appear here.</p>
            <Link to="/" className="btn-amazon-primary px-8 py-2.5">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
