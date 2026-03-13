import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import CategoryGrid from '../../components/CategoryGrid/CategoryGrid';
import DealsSection from '../../components/DealsSection/DealsSection';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Footer from '../../components/Footer/Footer';
import { fetchProducts } from '../../services/api';

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [all, topRated] = await Promise.all([
          fetchProducts({ limit: 20 }),
          fetchProducts({ sort: 'rating', limit: 10 }),
        ]);
        setAllProducts(all);
        setBestSellers(topRated);
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#eaeded]">
      <Navbar />

      {/* Hero */}
      <HeroBanner />

      {/* Content */}
      <main className="max-w-screen-xl mx-auto px-3 py-4 flex flex-col gap-6">
        {/* Category grid */}
        <CategoryGrid />

        {/* Deals section */}
        <DealsSection products={allProducts.slice(0, 8)} />

        {/* Best Sellers */}
        <section className="bg-white p-5 rounded shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title mb-0">Best Sellers</h2>
            <Link to="/products?sort=rating" className="text-blue-600 hover:underline text-sm">See more</Link>
          </div>
          <ProductGrid products={bestSellers} loading={loading} skeletonCount={5} />
        </section>

        {/* All products */}
        <section className="bg-white p-5 rounded shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="section-title mb-0">Recommended For You</h2>
            <Link to="/products" className="text-blue-600 hover:underline text-sm">See all products</Link>
          </div>
          <ProductGrid products={allProducts} loading={loading} skeletonCount={10} />
        </section>
      </main>

      <Footer />
    </div>
  );
}
