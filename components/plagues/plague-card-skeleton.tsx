export function PlagueCardSkeleton() {
  return (
    <div
      aria-hidden
      className="flex flex-col bg-white rounded-2xl border border-gray-5 overflow-hidden"
    >
      <div className="aspect-[4/3] bg-gray-5 animate-pulse" />
      <div className="flex flex-col gap-3 p-5">
        <div className="space-y-1.5">
          <div className="h-5 w-2/3 rounded bg-gray-5 animate-pulse" />
          <div className="h-3.5 w-1/2 rounded bg-gray-5 animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <div className="h-3 w-full rounded bg-gray-5 animate-pulse" />
          <div className="h-3 w-5/6 rounded bg-gray-5 animate-pulse" />
          <div className="h-3 w-3/4 rounded bg-gray-5 animate-pulse" />
        </div>
        <div className="pt-3 border-t border-gray-5 flex items-center gap-2">
          <div className="h-7 w-14 rounded-md bg-gray-5 animate-pulse" />
          <div className="h-7 w-16 rounded-md bg-gray-5 animate-pulse" />
          <div className="ml-auto h-8 w-8 rounded-full bg-gray-5 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
