/** Skeleton shimmer cards shown while products are loading */
export function ProductSkeleton({ count = 5 }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded border border-gray-200 p-3 flex flex-col gap-3">
          <div className="skeleton-box w-full aspect-square rounded" />
          <div className="skeleton-box h-3 w-3/4 rounded" />
          <div className="skeleton-box h-3 w-1/2 rounded" />
          <div className="skeleton-box h-3 w-1/3 rounded" />
          <div className="skeleton-box h-8 w-full rounded" />
        </div>
      ))}
    </>
  );
}

/** Single skeleton card */
export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
      <div className="skeleton-box w-full aspect-square rounded" />
      <div className="flex flex-col gap-4">
        <div className="skeleton-box h-6 w-3/4 rounded" />
        <div className="skeleton-box h-4 w-1/4 rounded" />
        <div className="skeleton-box h-4 w-1/2 rounded" />
        <div className="skeleton-box h-24 w-full rounded" />
        <div className="skeleton-box h-10 w-1/2 rounded" />
      </div>
    </div>
  );
}
