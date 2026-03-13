import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(product.id);

  return (
    <div className="bg-white rounded shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col h-full relative">
      {/* Wishlist heart */}
      <button
        onClick={() => toggleWishlist(product)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white shadow-sm transition-all"
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {wishlisted
          ? <FaHeart className="text-red-500" size={16} />
          : <FiHeart className="text-gray-400 hover:text-red-400" size={16} />
        }
      </button>
      {/* Image */}
      <Link to={`/products/${product.id}`} className="block p-4 flex items-center justify-center h-48 bg-gray-50">
        <img
          src={product.image_url || product.image}
          alt={product.name || product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </Link>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link to={`/products/${product.id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-amazon transition-colors mb-1">
            {product.name || product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-1">
          <StarRating
            rating={product.rating?.rate ?? product.rating}
            count={product.rating?.count ?? product.review_count}
            size="sm"
          />
        </div>

        {/* Price */}
        <div className="mt-auto">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price.toFixed(2)}
          </span>
          {product.stock > 0 ? (
            <p className="text-xs text-green-700 font-medium mt-0.5">In Stock</p>
          ) : (
            <p className="text-xs text-red-600 font-medium mt-0.5">Out of Stock</p>
          )}
        </div>

        {/* Add to Cart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addToCart(product);
          }}
          disabled={product.stock <= 0}
          className="btn-amazon-primary mt-2 py-1.5 text-xs flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiShoppingCart size={12} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
