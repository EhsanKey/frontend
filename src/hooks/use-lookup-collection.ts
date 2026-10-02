'use client';

import { useGetRequest } from './use-get-request';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { QueryKey } from '@tanstack/react-query';

export interface UseLookupCollectionOptions<TItem> {
  queryKey: QueryKey;
  requestFn: (signal?: AbortSignal) => Promise<PaginatedResult<TItem>>;
  initialItems?: TItem[];
  pageSize?: number;
  enabled?: boolean;
  staleTime?: number;
}

/**
 * Loads a bounded collection (usually `pageSize: 100`) used to populate form selects
 * and filter bars. Replaces the copy-pasted `useGetRequest` + `PaginatedResult`
 * assembly that appeared in the campuses, teachings, resources and users modules.
 */
export function useLookupCollection<TItem>({
  queryKey,
  requestFn,
  initialItems = [],
  pageSize = 100,
  enabled = true,
  staleTime,
}: UseLookupCollectionOptions<TItem>): TItem[] {
  const { data } = useGetRequest<PaginatedResult<TItem>>({
    queryKey,
    requestFn,
    enabled,
    staleTime,
    initialData:
      initialItems.length > 0
        ? {
            items: initialItems,
            meta: {
              total: initialItems.length,
              page: 1,
              perPage: pageSize,
              pageSize,
              totalPages: 1,
            },
          }
        : undefined,
  });

  return data?.items?.length ? data.items : initialItems;
}

export default useLookupCollection;
