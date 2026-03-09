export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[#1e293b] rounded-xl border border-[#334155] p-4 animate-pulse"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="skeleton w-7 h-7 rounded-full" />
              <div>
                <div className="skeleton w-24 h-5 mb-1" />
                <div className="skeleton w-10 h-3" />
              </div>
            </div>
            <div className="skeleton w-14 h-14 rounded" />
          </div>
          <div className="skeleton w-20 h-10 mb-2" />
          <div className="skeleton w-32 h-4 mb-1" />
          <div className="skeleton w-40 h-3 mb-4" />
          <div className="skeleton w-full h-16 rounded-lg mb-4" />
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="skeleton w-full h-10 rounded-lg" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
