import { Skeleton } from '@heroui/react';

export const BroadcastCreateFallback = () => {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 sm:p-6 w-full animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-48 rounded-lg" />
          <Skeleton className="h-8 w-72 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>

      {/* Campaign Title Skeleton */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-2">
        <Skeleton className="h-4 w-40 rounded-md" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>

      {/* Audience Filter Card Skeleton */}
      <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-3">
        <Skeleton className="h-5 w-48 rounded-md" />
        <Skeleton className="h-12 w-full rounded-xl" />
      </div>

      {/* 2-Column: Editor & Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex flex-col gap-5">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-3">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-44 w-full rounded-xl" />
          </div>

          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-3">
            <Skeleton className="h-5 w-40 rounded-md" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-5 shadow-xs flex flex-col gap-3">
            <Skeleton className="h-5 w-36 rounded-md" />
            <Skeleton className="h-80 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BroadcastCreateFallback;
