import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch, FiShoppingCart, FiMapPin, FiChevronDown, FiMenu, FiX,
} from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { fetchCategories } from '../../services/api';

export default function Navbar() {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const accountRef = useRef();

  // Fetch categories for dropdown
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set('search', query);
    if (selectedCategory) params.set('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
  };

  // Sync query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('search') || params.get('q') || '';
    if (q) setQuery(q);
  }, [location.search]);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Main navbar ── */}
      <nav className="bg-amazon-dark flex items-center gap-2 px-4 py-2 text-white min-h-[60px]">
        {/* Logo */}
        <Link to="/" className="flex-shrink-0 mr-2 hover:ring-1 hover:ring-white rounded px-1">
          <div className="flex flex-col leading-none">
            <span className="text-white font-extrabold text-xl tracking-tighter">amazon</span>
            <span className="text-amazon text-[10px] font-semibold tracking-widest text-right">.clone</span>
          </div>
        </Link>

        {/* Location */}
        <div className="hidden md:flex flex-col cursor-pointer hover:ring-1 hover:ring-white px-2 py-1 rounded flex-shrink-0">
          <span className="text-gray-400 text-[10px]">Deliver to</span>
          <div className="flex items-center gap-1">
            <FiMapPin className="text-white" size={12} />
            <span className="text-white font-bold text-sm">India</span>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex flex-1 min-w-0 rounded overflow-hidden">
          {/* Category dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-gray-200 text-gray-700 text-xs px-2 border-r border-gray-400 focus:outline-none hidden sm:block flex-shrink-0 cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Amazon Clone"
            className="flex-1 px-3 py-2 text-gray-900 text-sm focus:outline-none min-w-0"
          />
          <button
            type="submit"
            className="bg-amazon hover:bg-amazon-hover px-4 flex items-center justify-center transition-colors"
          >
            <FiSearch className="text-gray-900" size={20} />
          </button>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Language */}
          <div className="hidden lg:flex items-center gap-0.5 nav-link">
            <span className="text-xs font-bold">EN</span>
            <FiChevronDown size={12} />
          </div>

          {/* Account */}
          <div
            ref={accountRef}
            className="relative hidden sm:flex flex-col nav-link"
            onClick={() => setAccountOpen((o) => !o)}
          >
            <span className="text-[10px] text-gray-400">Hello, John</span>
            <div className="flex items-center gap-0.5">
              <span className="font-bold text-sm">Account</span>
              <FiChevronDown size={12} />
            </div>
            {accountOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white text-gray-900 shadow-xl rounded w-52 z-50 text-sm animate-fade-in">
                <div className="p-4 border-b">
                  <p className="font-semibold">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </div>
                <ul className="p-2">
                  <li><Link to="/orders" className="block px-3 py-2 hover:bg-gray-100 rounded" onClick={() => setAccountOpen(false)}>Your Orders</Link></li>
                  <li><Link to="/wishlist" className="block px-3 py-2 hover:bg-gray-100 rounded" onClick={() => setAccountOpen(false)}>Your Wishlist ♥</Link></li>
                  <li><Link to="/cart" className="block px-3 py-2 hover:bg-gray-100 rounded" onClick={() => setAccountOpen(false)}>Your Cart</Link></li>
                </ul>
              </div>
            )}
          </div>

          {/* Orders */}
          <Link to="/orders" className="hidden lg:flex flex-col nav-link">
            <span className="text-[10px] text-gray-400">Returns</span>
            <span className="font-bold text-sm">& Orders</span>
          </Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-end gap-1 nav-link px-3">
            <div className="relative">
              <FiShoppingCart size={28} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-amazon text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <span className="font-bold text-sm hidden sm:block">Cart</span>
          </Link>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen((o) => !o)} className="sm:hidden nav-link p-1" aria-label="Menu">
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Sub navbar ── */}
      <div className="bg-amazon-light text-white text-sm flex items-center gap-4 px-4 py-1.5 overflow-x-auto scrollbar-hide">
        <Link to="/products" className="nav-link whitespace-nowrap flex items-center gap-1">
          <FiMenu size={14} /> All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${cat.id}`}
            className="nav-link whitespace-nowrap"
          >
            {cat.name}
          </Link>
        ))}
        <Link to="/orders" className="nav-link whitespace-nowrap">Today's Deals</Link>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div className="sm:hidden bg-amazon-dark text-white p-4 flex flex-col gap-3 animate-fade-in">
          <Link to="/cart" className="nav-link" onClick={() => setMobileOpen(false)}>Cart ({cartCount})</Link>
          <Link to="/products" className="nav-link" onClick={() => setMobileOpen(false)}>All Products</Link>
          <Link to="/orders" className="nav-link" onClick={() => setMobileOpen(false)}>Your Orders</Link>
          {categories.map((cat) => (
            <Link key={cat.id} to={`/products?category=${cat.id}`} className="nav-link" onClick={() => setMobileOpen(false)}>{cat.name}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
