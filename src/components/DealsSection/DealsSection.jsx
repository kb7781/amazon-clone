import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { useCart } from '../../context/CartContext';

/** Countdown timer hook – counts down from `seconds` */
function useCountdown(seconds) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  useEffect(() => {
    const id = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : seconds)), 1000);
    return () => clearInterval(id);
  }, [seconds]);
  const h = String(Math.floor(timeLeft / 3600)).padStart(2, '0');
  const m = String(Math.floor((timeLeft % 3600) / 60)).padStart(2, '0');
  const s = String(timeLeft % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

function DealCard({ product }) {
  const { addToCart } = useCart();
  const discount = Math.floor(Math.random() * 40) + 20;
  const timer = useCountdown(Math.floor(Math.random() * 14400) + 3600);

  return (
    <div className="bg-white rounded border border-gray-200 p-3 flex flex-col min-w-[180px] max-w-[200px] card-hover cursor-pointer flex-shrink-0">
      {/* Timer */}
      <div className="bg-gray-900 text-white text-center rounded py-1 mb-2 text-xs font-mono font-bold">
        🔥 Ends in {timer}
      </div>
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-square flex items-center justify-center overflow-hidden p-2 mb-2">
          <img
            src={product.image_url || product.image}
            alt={product.name || product.title}
            className="max-h-full object-contain"
            loading="lazy"
          />
        </div>
        <p className="text-xs text-gray-700 line-clamp-2 mb-1 font-medium">{product.name || product.title}</p>
        <StarRating rating={product.rating?.rate ?? product.rating} count={product.rating?.count ?? product.review_count} />
        <div className="flex items-center gap-2 mt-1">
          <span className="font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
          <span className="text-xs text-red-600 font-semibold">-{discount}%</span>
        </div>
      </Link>
      <button onClick={() => addToCart(product)} className="mt-auto btn-amazon text-xs py-1.5">
        Add to Cart
      </button>
    </div>
  );
}

export default function DealsSection({ products = [] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-white p-6 rounded shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title mb-0">Today's Deals</h2>
        <Link to="/products" className="text-blue-600 hover:underline text-sm font-medium">
          See all deals →
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.slice(0, 8).map((p) => (
          <DealCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
