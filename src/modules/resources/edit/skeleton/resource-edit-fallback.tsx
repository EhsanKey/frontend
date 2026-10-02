import { Skeleton } from '@heroui/react';

export const ResourceEditFallback = () => {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto p-4 sm:p-6 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-40 rounded-lg" />
          <Skeleton className="h-8 w-64 rounded-xl" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-24 rounded-xl" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </div>
      </div>

      {/* Student & Status Info Card Skeleton */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-5 w-32 rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-5 w-24 rounded-lg" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-3 w-20 rounded-md" />
            <Skeleton className="h-5 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Title & Kind Card Skeleton */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
        <Skeleton className="h-5 w-44 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-11 w-full rounded-xl md:col-span-2" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>

      {/* Academic Hierarchy Card Skeleton */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
        <Skeleton className="h-5 w-44 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl md:col-span-2" />
        </div>
      </div>

      {/* Professor & Course Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
        <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col gap-4 shadow-xs">
          <Skeleton className="h-5 w-32 rounded-lg" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default ResourceEditFallback;
