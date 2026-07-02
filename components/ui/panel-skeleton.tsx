export function PanelSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-s2 py-s2">
      {Array.from({ length: rows }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton rows, never reordered
        <div key={i} className="flex items-center gap-s2">
          <div className="h-10 w-10 rounded-full bg-gray-5 animate-pulse shrink-0" />
          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-4 w-1/2 rounded bg-gray-5 animate-pulse" />
            <div className="h-3 w-1/3 rounded bg-gray-5 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
