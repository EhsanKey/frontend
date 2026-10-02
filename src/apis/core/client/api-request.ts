'use client';

import { createApiExceptionFromPayload } from '../api-error';
import { clientApiClient } from './api-client';
import type {
  ApiErrorPayload,
  PaginatedResult,
} from '@/apis/core/types/api-response';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export async function clientApiRequest<TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
  const response = await clientApiClient.request<
    unknown,
    AxiosResponse<unknown>,
    TBody
  >(config);

  const payload = response.data;

  // Only throw if explicit success: false is returned
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    (payload as { success?: boolean }).success === false
  ) {
    const errorPayload = (payload as { error?: ApiErrorPayload }).error;
    throw createApiExceptionFromPayload(errorPayload, response.status);
  }

  // If payload is wrapped in { success: true, data: ... }
  if (
    payload &&
    typeof payload === 'object' &&
    'data' in payload &&
    (payload as { data?: unknown }).data !== undefined
  ) {
    return (payload as { data: TResponse }).data;
  }

  return payload as TResponse;
}

export async function clientApiPaginatedRequest<TItem, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<PaginatedResult<TItem>> {
  const response = await clientApiClient.request<
    unknown,
    AxiosResponse<unknown>,
    TBody
  >(config);

  const payload = response.data;

  // Only throw if explicit success: false is returned
  if (
    payload &&
    typeof payload === 'object' &&
    'success' in payload &&
    (payload as { success?: boolean }).success === false
  ) {
    const errorPayload = (payload as { error?: ApiErrorPayload }).error;
    throw createApiExceptionFromPayload(errorPayload, response.status);
  }

  // 1. Resolve items array (could be payload.items, payload.data, or payload itself)
  let items: TItem[] = [];
  if (Array.isArray(payload)) {
    items = payload as TItem[];
  } else if (payload && typeof payload === 'object') {
    const obj = payload as Record<string, unknown>;
    if (Array.isArray(obj.items)) {
      items = obj.items as TItem[];
    } else if (Array.isArray(obj.data)) {
      items = obj.data as TItem[];
    }
  }

  // 2. Resolve metadata (could be in payload.meta, or directly on payload)
  const rawMeta = (
    payload && typeof payload === 'object' && 'meta' in payload && payload.meta
      ? payload.meta
      : payload || {}
  ) as Record<string, unknown>;

  const paginationSource = (
    rawMeta && typeof rawMeta === 'object' && 'pagination' in rawMeta && rawMeta.pagination && typeof rawMeta.pagination === 'object'
      ? rawMeta.pagination
      : rawMeta
  ) as Record<string, unknown>;

  const total =
    typeof paginationSource.total === 'number'
      ? paginationSource.total
      : typeof rawMeta.total === 'number'
        ? rawMeta.total
        : items.length;
  const perPage =
    typeof paginationSource.perPage === 'number'
      ? paginationSource.perPage
      : typeof paginationSource.pageSize === 'number'
        ? paginationSource.pageSize
        : typeof paginationSource.limit === 'number'
          ? paginationSource.limit
          : typeof rawMeta.perPage === 'number'
            ? rawMeta.perPage
            : typeof rawMeta.pageSize === 'number'
              ? rawMeta.pageSize
              : typeof rawMeta.limit === 'number'
                ? rawMeta.limit
                : items.length || 10;
  const page =
    typeof paginationSource.page === 'number'
      ? paginationSource.page
      : typeof rawMeta.page === 'number'
        ? rawMeta.page
        : typeof paginationSource.offset === 'number' && perPage > 0
          ? Math.floor(paginationSource.offset / perPage) + 1
          : 1;
  const totalPages =
    typeof paginationSource.totalPages === 'number'
      ? paginationSource.totalPages
      : typeof rawMeta.totalPages === 'number'
        ? rawMeta.totalPages
        : perPage > 0
          ? Math.ceil(total / perPage) || 1
          : 1;

  const stats = (rawMeta.stats || (payload && typeof payload === 'object' && (payload as any).stats)) as unknown;

  return {
    items,
    meta: {
      page,
      perPage,
      pageSize: typeof paginationSource.pageSize === 'number' ? paginationSource.pageSize : typeof rawMeta.pageSize === 'number' ? rawMeta.pageSize : perPage,
      limit: typeof paginationSource.limit === 'number' ? paginationSource.limit : typeof rawMeta.limit === 'number' ? rawMeta.limit : perPage,
      offset:
        typeof paginationSource.offset === 'number'
          ? paginationSource.offset
          : typeof rawMeta.offset === 'number'
            ? rawMeta.offset
            : (page - 1) * perPage,
      total,
      totalPages,
      ...(stats ? { stats } : {}),
    },
  };
}
