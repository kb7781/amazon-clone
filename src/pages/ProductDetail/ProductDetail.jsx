import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import StarRating from '../../components/StarRating/StarRating';
import ProductCard from '../../components/ProductCard/ProductCard';
import { ProductDetailSkeleton } from '../../components/LoadingSkeleton/ProductSkeleton';
import { fetchProductById, fetchProducts } from '../../services/api';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiShoppingCart, FiTruck, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

function WishlistButton({ product }) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);
  return (
    <button
      onClick={() => toggleWishlist(product)}
      className={`w-full py-2.5 rounded-lg border-2 font-medium text-sm flex items-center justify-center gap-2 transition-all ${wishlisted
          ? 'border-red-400 bg-red-50 text-red-600'
          : 'border-gray-300 bg-white text-gray-700 hover:border-red-300 hover:text-red-500'
        }`}
    >
      {wishlisted ? <FaHeart size={14} /> : <FiHeart size={14} />}
      {wishlisted ? 'In Your Wishlist' : 'Add to Wishlist'}
    </button>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveImg(0);
    setQty(1);
    const load = async () => {
      try {
        const p = await fetchProductById(id);
        setProduct(p);
        // Fetch related products from same category
        const rel = await fetchProducts({ category: p.category_id, limit: 7 });
        setRelated(rel.filter((r) => r.id !== p.id).slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />
      <div className="max-w-screen-xl mx-auto bg-white my-4 rounded shadow-sm">
        <ProductDetailSkeleton />
      </div>
      <Footer />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-lg">Product not found.</p>
    </div>
  );

  const discount = Math.floor(Math.random() * 30) + 5;
  const originalPrice = (product.price * (1 + discount / 100)).toFixed(2);

  // Build gallery: main image + product_images from API
  const images = [product.image_url, ...(product.images || [])];

  const handleAddToCart = () => {
    addToCart(product, qty);
  };

  const handleBuyNow = () => {
    addToCart(product, qty);
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-4 py-2 text-xs text-gray-500 flex gap-2">
        <Link to="/" className="hover:text-amazon hover:underline">Home</Link>
        <span>›</span>
        <Link to="/products" className="hover:text-amazon hover:underline">Products</Link>
        <span>›</span>
        <Link
          to={`/products?category=${product.category_id}`}
          className="hover:text-amazon hover:underline"
        >
          {product.category}
        </Link>
        <span>›</span>
        <span className="text-gray-700 truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main content */}
      <div className="max-w-screen-xl mx-auto px-3">
        <div className="bg-white rounded shadow-sm p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-4">
          {/* ── Image section ── */}
          <div className="flex gap-3">
            {/* Thumbnails */}
            <div className="flex flex-col gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`w-14 h-14 border-2 rounded p-1 transition-all ${activeImg === i ? 'border-amazon' : 'border-gray-200 hover:border-gray-400'
                    }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 flex items-center justify-center border border-gray-200 rounded p-6 min-h-64">
              <img
                src={images[activeImg]}
                alt={product.name}
                className="max-h-80 max-w-full object-contain transition-all duration-300"
              />
            </div>
          </div>

          {/* ── Info section ── */}
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 mb-1">
              Category: <span className="capitalize">{product.category}</span>
            </span>
            <h1 className="text-xl font-medium text-gray-900 mb-2 leading-snug">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-3">
              <StarRating rating={product.rating} count={product.review_count} size="md" />
            </div>

            <hr className="border-gray-200 mb-3" />

            {/* Price */}
            <div className="mb-3">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
                <span className="text-sm text-gray-500 line-through">₹{originalPrice}</span>
                <span className="text-red-600 font-semibold text-sm">-{discount}% off</span>
              </div>
              {product.stock > 0 ? (
                <p className="text-green-700 font-semibold text-sm mt-1">In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-red-600 font-semibold text-sm mt-1">Out of Stock</p>
              )}
            </div>

            {/* Delivery */}
            <div className="flex items-center gap-2 text-sm text-gray-700 mb-4 bg-blue-50 rounded p-3">
              <FiTruck className="text-blue-600" />
              <span>FREE delivery by <strong>Tomorrow</strong> if you order in the next 12 hours</span>
            </div>

            {/* Description */}
            <div className="mb-4">
              <h3 className="font-semibold text-sm mb-2">About this item</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
            </div>
          </div>

          {/* ── Buy box ── */}
          <div className="border border-gray-300 rounded p-4 flex flex-col gap-4 h-fit">
            <div>
              <span className="text-2xl font-bold">₹{product.price.toFixed(2)}</span>
              <p className="text-xs text-gray-500">+ FREE Returns</p>
            </div>
            {product.stock > 0 ? (
              <p className="text-green-700 font-semibold text-sm">In Stock</p>
            ) : (
              <p className="text-red-600 font-semibold text-sm">Out of Stock</p>
            )}

            {/* Qty selector */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Qty:</label>
              <select
                value={qty}
                onChange={(e) => setQty(+e.target.value)}
                className="input-amazon w-auto py-1"
              >
                {Array.from({ length: Math.min(10, product.stock) }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="btn-amazon-primary w-full py-2.5 disabled:opacity-50"
            >
              <FiShoppingCart className="inline mr-2" />
              Add to Cart
            </button>
            <WishlistButton product={product} />
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="btn-amazon-secondary w-full py-2.5 disabled:opacity-50"
            >
              Buy Now
            </button>

            {/* Secure transaction note */}
            <p className="text-xs text-gray-500 text-center">🔒 Secure transaction</p>
          </div>
        </div>

        {/* Full description */}
        <div className="bg-white rounded shadow-sm p-6 mb-4">
          <h2 className="section-title">Product Description</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{product.description}</p>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="bg-white rounded shadow-sm p-6 mb-4">
            <h2 className="section-title">Customers Also Bought</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
