export const BotFlowFallback = () => {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="p-5 rounded-3xl border border-default-200/50 bg-default-100/40 h-24 flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-64 bg-default-200 rounded-lg" />
          <div className="h-4 w-96 bg-default-200/60 rounded-md" />
        </div>
        <div className="flex gap-2">
          <div className="h-9 w-28 bg-default-200 rounded-xl" />
          <div className="h-9 w-32 bg-default-200 rounded-xl" />
        </div>
      </div>

      {/* KPI Cards Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-default-200/50 bg-default-100/40 p-3.5 h-24 space-y-2"
          >
            <div className="h-3 w-16 bg-default-200 rounded" />
            <div className="h-6 w-12 bg-default-200 rounded" />
            <div className="h-2 w-24 bg-default-200/60 rounded" />
          </div>
        ))}
      </div>

      {/* Simulation Runner Skeleton */}
      <div className="rounded-2xl border border-default-200/50 bg-default-100/40 p-4 h-32" />

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 h-[620px] rounded-2xl border border-default-200/50 bg-default-100/30" />
        <div className="xl:col-span-4 h-[620px] rounded-2xl border border-default-200/50 bg-default-100/30" />
      </div>
    </div>
  );
};
