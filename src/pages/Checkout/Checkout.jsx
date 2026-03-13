import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useCart } from '../../context/CartContext';
import { placeOrder } from '../../services/api';
import { FiMapPin, FiShoppingBag, FiChevronRight, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Review', 'Payment'];

const INITIAL_ADDRESS = {
  name: '', phone: '', address: '', city: '', state: '', pincode: '',
};

function validate(addr) {
  const errs = {};
  if (!addr.name.trim()) errs.name = 'Full name is required';
  if (!addr.phone.trim()) errs.phone = 'Phone number is required';
  if (!addr.address.trim()) errs.address = 'Address is required';
  if (!addr.city.trim()) errs.city = 'City is required';
  if (!addr.pincode.trim()) errs.pincode = 'Pincode is required';
  return errs;
}

export default function Checkout() {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(INITIAL_ADDRESS);
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const shippingFee = cartTotal > 4999 ? 0 : 99;
  const tax = parseFloat((cartTotal * 0.08).toFixed(2));
  const total = parseFloat((cartTotal + shippingFee + tax).toFixed(2));

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#eaeded]">
        <Navbar />
        <div className="flex items-center justify-center h-64 flex-col gap-4">
          <p className="text-xl text-gray-600 font-medium">Your cart is empty.</p>
          <Link to="/" className="btn-amazon-primary px-8">Start Shopping</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAddressChange = (e) => {
    setAddress((a) => ({ ...a, [e.target.name]: e.target.value }));
    setErrors((e2) => ({ ...e2, [e.target.name]: '' }));
  };

  const handleNextStep = () => {
    if (step === 0) {
      const errs = validate(address);
      if (Object.keys(errs).length) { setErrors(errs); return; }
    }
    setStep((s) => s + 1);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async () => {
    setPlacing(true);
    try {
      const result = await placeOrder({
        shipping_address: address,
        items: cartItems.map((i) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
        })),
      });
      clearCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirmation/${result.orderId}`, {
        state: { order: result.order, items: result.items, address },
      });
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-screen-lg mx-auto px-4 py-3 flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`flex items-center gap-2 px-3 py-1 rounded ${i === step ? 'text-amazon font-bold' : i < step ? 'text-green-600' : 'text-gray-400'}`}>
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i < step ? 'bg-green-600 text-white' : i === step ? 'bg-amazon text-black' : 'bg-gray-200 text-gray-500'}`}>
                  {i < step ? <FiCheck size={12} /> : i + 1}
                </span>
                <span className="text-sm hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <FiChevronRight className="text-gray-300 mx-1" />}
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-screen-lg mx-auto px-3 py-5">
        <div className="flex gap-5 items-start flex-col lg:flex-row">
          {/* ── Left: Step content ── */}
          <div className="flex-1 min-w-0 space-y-4">

            {/* STEP 0: Shipping Address */}
            {step === 0 && (
              <div className="bg-white rounded shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <FiMapPin className="text-amazon" size={20} />
                  <h2 className="font-bold text-xl text-gray-900">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input name="name" value={address.name} onChange={handleAddressChange} placeholder="Enter your full name" className={`input-amazon ${errors.name ? 'border-red-500' : ''}`} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange} placeholder="+91 98765 43210" className={`input-amazon ${errors.phone ? 'border-red-500' : ''}`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                    <input name="state" value={address.state} onChange={handleAddressChange} placeholder="Maharashtra" className="input-amazon" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                    <input name="address" value={address.address} onChange={handleAddressChange} placeholder="House No., Building, Street, Area" className={`input-amazon ${errors.address ? 'border-red-500' : ''}`} />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange} placeholder="Mumbai" className={`input-amazon ${errors.city ? 'border-red-500' : ''}`} />
                    {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input name="pincode" value={address.pincode} onChange={handleAddressChange} placeholder="400001" className={`input-amazon ${errors.pincode ? 'border-red-500' : ''}`} />
                    {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: Review Order */}
            {step === 1 && (
              <div className="bg-white rounded shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FiShoppingBag className="text-amazon" size={20} />
                  <h2 className="font-bold text-xl text-gray-900">Review Your Order</h2>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-5 text-sm">
                  <p className="font-semibold text-gray-800 mb-1">Delivering to:</p>
                  <p className="text-gray-700">{address.name} · {address.phone}</p>
                  <p className="text-gray-700">{address.address}, {address.city}{address.state ? `, ${address.state}` : ''} – {address.pincode}</p>
                  <button onClick={() => setStep(0)} className="text-blue-600 hover:underline text-xs mt-2">Change</button>
                </div>

                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 py-3 border-b border-gray-100 last:border-0">
                      <img src={item.image_url} alt={item.name} className="w-16 h-16 object-contain border border-gray-200 rounded p-1" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.name}</p>
                        <p className="text-xs text-green-700 mt-0.5">In Stock · FREE Delivery</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-bold text-gray-900 text-sm">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2: Payment */}
            {step === 2 && (
              <div className="bg-white rounded shadow-sm p-6">
                <h2 className="font-bold text-xl text-gray-900 mb-5">Payment Method</h2>
                <div className="space-y-3">
                  {[
                    { id: 'cod', label: 'Cash on Delivery', badge: 'Popular' },
                    { id: 'upi', label: 'UPI (GPay, PhonePe, Paytm)', badge: null },
                    { id: 'card', label: 'Debit / Credit Card', badge: null },
                    { id: 'netbanking', label: 'Net Banking', badge: null },
                  ].map((m) => (
                    <label key={m.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded cursor-pointer hover:border-amazon transition-colors">
                      <input type="radio" name="payment" defaultChecked={m.id === 'cod'} className="accent-amazon" />
                      <span className="text-sm font-medium">{m.label}</span>
                      {m.badge && <span className="ml-auto text-xs bg-amazon text-black px-2 py-0.5 rounded font-semibold">{m.badge}</span>}
                    </label>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 flex items-center gap-1">
                  🔒 All transactions are secure and encrypted.
                </p>
              </div>
            )}

            {/* Nav buttons */}
            <div className="flex justify-between">
              {step > 0 ? (
                <button onClick={() => setStep((s) => s - 1)} className="btn-amazon px-6">← Back</button>
              ) : (
                <Link to="/cart" className="btn-amazon px-6">← Back to Cart</Link>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={handleNextStep} className="btn-amazon-primary px-8 py-2.5">
                  Continue →
                </button>
              ) : (
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-amazon-secondary px-8 py-2.5 disabled:opacity-60 flex items-center gap-2">
                  {placing && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                  Place Order
                </button>
              )}
            </div>
          </div>

          {/* ── Right: Order summary ── */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white rounded shadow-sm p-5 sticky top-24">
              <h3 className="font-bold text-lg mb-3 border-b border-gray-200 pb-2">Order Summary</h3>
              <div className="space-y-2 text-sm mb-3">
                <div className="flex justify-between"><span className="text-gray-600">Items ({cartCount})</span><span>₹{cartTotal.toFixed(2)}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shippingFee === 0 ? 'text-green-700' : ''}>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">Tax (8%)</span><span>₹{tax}</span></div>
              </div>
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
                <span>Order Total</span><span className="text-lg">₹{total}</span>
              </div>
              {step === STEPS.length - 1 && (
                <button onClick={handlePlaceOrder} disabled={placing} className="btn-amazon-secondary w-full mt-4 py-2.5 disabled:opacity-60 flex items-center justify-center gap-2">
                  {placing && <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />}
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
