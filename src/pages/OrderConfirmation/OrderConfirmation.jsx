import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { fetchOrderById } from '../../services/api';
import { FiPackage, FiTruck, FiCheckCircle, FiHome, FiList } from 'react-icons/fi';

function OrderTimeline() {
  const steps = [
    { icon: <FiCheckCircle />, label: 'Order Placed', done: true },
    { icon: <FiPackage />, label: 'Processing', done: true },
    { icon: <FiTruck />, label: 'Out for Delivery', done: false },
    { icon: <FiHome />, label: 'Delivered', done: false },
  ];
  return (
    <div className="flex items-start gap-0 mt-4 mb-6">
      {steps.map((s) => (
        <div key={s.label} className="flex-1 flex flex-col items-center text-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm mb-1 ${s.done ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
            {s.icon}
          </div>
          <p className={`text-xs font-medium mt-1 ${s.done ? 'text-green-700' : 'text-gray-400'}`}>{s.label}</p>
        </div>
      ))}
    </div>
  );
}

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const location = useLocation();

  const [order, setOrder] = useState(location.state?.order || null);
  const [items, setItems] = useState(location.state?.items || []);
  const [loading, setLoading] = useState(!location.state?.order);

  // Calculate estimated delivery (5 business days)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  const deliveryStr = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  useEffect(() => {
    if (!order && orderId) {
      fetchOrderById(orderId)
        .then((data) => { setOrder(data); setItems(data.items || []); })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId, order]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#eaeded]"><Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="w-10 h-10 border-4 border-amazon border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer /></div>
    );
  }

  const addr = order?.shipping_address || location.state?.address || {};
  const displayTotal = order?.total_amount || order?.total;

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />
      <main className="max-w-screen-lg mx-auto px-3 py-6">

        {/* ── Success banner ── */}
        <div className="bg-white rounded shadow-sm p-6 mb-4 text-center border-t-4 border-green-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="text-green-600 text-3xl" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Order Placed Successfully! 🎉</h1>
          <p className="text-gray-600 text-sm mb-4">Thank you for shopping with Amazon Clone. Your order has been confirmed.</p>

          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg inline-block px-8 py-4 mb-4">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
            <p className="text-xl font-mono font-bold text-amazon tracking-wider">{orderId}</p>
          </div>

          <p className="text-sm text-gray-600">
            Estimated Delivery: <strong className="text-green-700">{deliveryStr}</strong>
          </p>
        </div>

        {/* ── Order timeline ── */}
        <div className="bg-white rounded shadow-sm p-6 mb-4">
          <h2 className="font-bold text-lg mb-2">Order Status</h2>
          <OrderTimeline />
          <p className="text-xs text-gray-500">Your order is being processed and will be dispatched soon.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* ── Delivery address ── */}
          <div className="bg-white rounded shadow-sm p-5">
            <h2 className="font-bold text-base mb-3 flex items-center gap-2"><FiHome /> Delivery Address</h2>
            {addr.name ? (
              <address className="not-italic text-sm text-gray-700 space-y-0.5">
                <p className="font-semibold">{addr.name}</p>
                <p>{addr.address}</p>
                <p>{addr.city}{addr.state ? `, ${addr.state}` : ''} – {addr.pincode || addr.zip}</p>
                {addr.phone && <p>Phone: {addr.phone}</p>}
              </address>
            ) : (
              <p className="text-sm text-gray-400">Address not available</p>
            )}
          </div>

          {/* ── Order totals ── */}
          <div className="bg-white rounded shadow-sm p-5">
            <h2 className="font-bold text-base mb-3">Order Summary</h2>
            <div className="text-sm space-y-1">
              {displayTotal && (
                <div className="flex justify-between font-bold text-base border-t border-gray-100 pt-2 mt-2">
                  <span>Total Charged</span>
                  <span>₹{Number(displayTotal).toFixed(2)}</span>
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">Payment Method: Cash on Delivery</p>
            </div>
          </div>
        </div>

        {/* ── Items ── */}
        {items.length > 0 && (
          <div className="bg-white rounded shadow-sm p-6 mb-4">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><FiPackage /> Items in This Order</h2>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.name} className="w-16 h-16 object-contain border border-gray-200 rounded p-1 flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link to={`/products/${item.product_id}`} className="text-sm font-medium text-gray-900 hover:text-amazon line-clamp-2">
                      {item.name || item.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity || item.qty}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm flex-shrink-0">
                    ₹{(item.price * (item.quantity || item.qty)).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CTA buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-amazon-primary text-center py-3 px-8 text-base">
            <FiHome className="inline mr-2" /> Continue Shopping
          </Link>
          <Link to="/orders" className="btn-amazon text-center py-3 px-8 text-base">
            <FiList className="inline mr-2" /> View All Orders
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
