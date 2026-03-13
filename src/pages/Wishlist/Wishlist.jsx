import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { FiHeart, FiTrash2, FiShoppingCart, FiShoppingBag } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';

export default function Wishlist() {
    const { wishlistItems, toggleWishlist } = useWishlist();
    const { addToCart } = useCart();

    return (
        <div className="min-h-screen bg-[#eaeded]">
            <Navbar />
            <main className="max-w-screen-lg mx-auto px-3 py-5">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FaHeart className="text-red-500" /> Your Wishlist
                    </h1>
                    <Link to="/products" className="text-blue-600 hover:underline text-sm">
                        Continue Shopping →
                    </Link>
                </div>

                {wishlistItems.length === 0 ? (
                    <div className="bg-white rounded shadow-sm p-12 text-center">
                        <FiHeart className="mx-auto text-gray-200 mb-4" size={64} />
                        <h2 className="text-xl font-medium text-gray-700 mb-2">Your wishlist is empty</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Save items by clicking the ♡ heart icon on any product.
                        </p>
                        <Link to="/" className="btn-amazon-primary px-8 py-2.5">
                            Explore Products
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-gray-500">
                            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved
                        </p>

                        {wishlistItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded shadow-sm p-4 flex gap-4 items-center"
                            >
                                {/* Image */}
                                <Link
                                    to={`/products/${item.id}`}
                                    className="flex-shrink-0 w-24 h-24 flex items-center justify-center border border-gray-200 rounded p-2"
                                >
                                    <img
                                        src={item.image_url || item.image}
                                        alt={item.name || item.title}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                </Link>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <Link to={`/products/${item.id}`}>
                                        <h3 className="font-medium text-gray-900 text-sm hover:text-amazon line-clamp-2 mb-1">
                                            {item.name || item.title}
                                        </h3>
                                    </Link>
                                    <p className="text-lg font-bold text-gray-900 mb-1">
                                        ₹{item.price?.toFixed(2)}
                                    </p>
                                    {item.stock > 0 ? (
                                        <p className="text-xs text-green-700 font-semibold">In Stock</p>
                                    ) : (
                                        <p className="text-xs text-red-600 font-semibold">Out of Stock</p>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 flex-shrink-0">
                                    <button
                                        onClick={() => {
                                            addToCart(item);
                                            toggleWishlist(item);
                                        }}
                                        className="btn-amazon-primary px-4 py-2 text-xs flex items-center gap-1"
                                    >
                                        <FiShoppingCart size={12} /> Move to Cart
                                    </button>
                                    <button
                                        onClick={() => toggleWishlist(item)}
                                        className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1 justify-center transition-colors"
                                    >
                                        <FiTrash2 size={12} /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
