import ProductCard from '../ProductCard/ProductCard';
import { ProductSkeleton } from '../LoadingSkeleton/ProductSkeleton';

/**
 * ProductGrid – responsive grid of ProductCards
 * @param {Array}   products - array of product objects
 * @param {boolean} loading  - show skeleton if true
 * @param {number}  skeletonCount
 */
export default function ProductGrid({ products = [], loading = false, skeletonCount = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
      {loading ? (
        <ProductSkeleton count={skeletonCount} />
      ) : products.length === 0 ? (
        <div className="col-span-full text-center py-16 text-gray-500">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-lg font-medium">No products found</p>
          <p className="text-sm mt-1">Try adjusting your filters or search query</p>
        </div>
      ) : (
        products.map((p) => <ProductCard key={p.id} product={p} />)
      )}
    </div>
  );
}
