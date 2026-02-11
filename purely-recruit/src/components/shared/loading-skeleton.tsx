export function LoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-12 rounded-lg bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-lg border bg-white p-6">
      <div className="h-4 w-1/3 rounded bg-gray-200" />
      <div className="mt-3 h-8 w-1/2 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-1/4 rounded bg-gray-200" />
    </div>
  );
}
