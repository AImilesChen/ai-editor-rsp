export default function LoadingSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-lg overflow-hidden shadow-md">
          <div className="aspect-[4/3] animate-shimmer" />
          <div className="p-5">
            <div className="h-3 animate-shimmer rounded-sm mb-2.5 w-1/3" />
            <div className="h-4 animate-shimmer rounded-sm mb-2" />
            <div className="h-3 animate-shimmer rounded-sm mb-1.5 w-3/4" />
            <div className="h-3 animate-shimmer rounded-sm w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
