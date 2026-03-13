import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { fetchProducts, fetchCategories } from '../../services/api';
import { FiFilter, FiMenu } from 'react-icons/fi';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'newest', label: 'Newest Arrivals' },
];

const PAGE_SIZE = 12;

export default function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(sortParam);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch categories
  useEffect(() => {
    fetchCategories().then(setCategories).catch(console.error);
  }, []);

  // Fetch products
  useEffect(() => {
    setPage(1);
    setLoading(true);
    const load = async () => {
      try {
        const data = await fetchProducts({
          search: searchParam,
          category: categoryParam,
          sort: sortBy,
          limit: 100,
        });
        setProducts(data);

        if (data.length) {
          const prices = data.map((p) => p.price);
          const max = Math.ceil(Math.max(...prices));
          setPriceRange([0, max]);
          setMaxPrice(max);
          setMinPrice(0);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [categoryParam, searchParam, sortBy]);

  // Client-side price filtering
  const filtered = products.filter(
    (p) => p.price >= minPrice && p.price <= maxPrice
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetFilters = () => {
    setMinPrice(priceRange[0]);
    setMaxPrice(priceRange[1]);
    setSortBy('');
    setPage(1);
    setSearchParams({});
  };

  const selectedCategory = categories.find((c) => String(c.id) === String(categoryParam));
  const pageTitle = searchParam
    ? `Results for "${searchParam}"`
    : selectedCategory
      ? selectedCategory.name
      : 'All Products';

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-3 py-4">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded shadow-sm">
          <div>
            <h1 className="font-bold text-lg text-gray-900">{pageTitle}</h1>
            {!loading && <p className="text-xs text-gray-500 mt-0.5">{filtered.length} results</p>}
          </div>
          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-600 hidden sm:block">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="input-amazon w-auto py-1"
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setSidebarOpen((o) => !o)}
              className="md:hidden btn-amazon flex items-center gap-1"
            >
              <FiFilter size={14} /> Filters
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          {/* ── Sidebar ── */}
          <aside className={`${sidebarOpen ? 'block' : 'hidden'} md:block w-full md:w-56 flex-shrink-0`}>
            <div className="bg-white rounded shadow-sm p-4 sticky top-24 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-gray-900">Filters</h3>
                <button onClick={resetFilters} className="text-xs text-blue-600 hover:underline">Clear all</button>
              </div>

              {/* Category filter */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Category</h4>
                <ul className="space-y-1">
                  <li>
                    <Link
                      to="/products"
                      className={`text-sm text-blue-600 hover:underline block py-0.5 ${!categoryParam ? 'font-bold text-gray-900' : ''}`}
                    >
                      All
                    </Link>
                  </li>
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        to={`/products?category=${cat.id}`}
                        className={`text-sm text-blue-600 hover:underline block py-0.5 ${String(categoryParam) === String(cat.id) ? 'font-bold text-gray-900' : ''}`}
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-gray-600">Min: ₹{minPrice}</label>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={minPrice}
                    onChange={(e) => { setMinPrice(+e.target.value); setPage(1); }}
                    className="accent-amazon"
                  />
                  <label className="text-xs text-gray-600">Max: ₹{maxPrice}</label>
                  <input
                    type="range"
                    min={priceRange[0]}
                    max={priceRange[1]}
                    value={maxPrice}
                    onChange={(e) => { setMaxPrice(+e.target.value); setPage(1); }}
                    className="accent-amazon"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* ── Product grid ── */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={paginated} loading={loading} skeletonCount={PAGE_SIZE} />

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-amazon disabled:opacity-40"
                >
                  ← Prev
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-8 h-8 rounded border text-sm font-medium transition-colors ${page === i + 1
                      ? 'bg-amazon border-amazon-hover text-black'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-gray-500'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-amazon disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
