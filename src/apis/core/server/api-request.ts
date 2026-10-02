import 'server-only';

import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/constants';
import { getMockResponse } from '@/app/api/backend/mock-store';
import { createApiExceptionFromPayload, normalizeApiError } from '../api-error';
import type {
  ApiErrorPayload,
  ApiResponse,
  PaginatedResult,
} from '@/apis/core/types/api-response';

const API_BASE_URL = process.env.API_BASE_URL;

async function getAccessToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE_NAME)?.value;
}

function resolveUpstreamUrl(url: string, baseUrl?: string): { finalUrl: string } {
  if (!baseUrl) {
    return { finalUrl: url };
  }
  const cleanBase = baseUrl.replace(/\/+$/, '');
  const apiV1Base = cleanBase.endsWith('/api/v1') ? cleanBase : `${cleanBase}/api/v1`;
  const origin = cleanBase.replace(/\/api\/v1\/?$/, '');

  let pathStr = url.replace(/^\/+/, '');
  if (pathStr.startsWith('api/backend/')) {
    pathStr = pathStr.slice(12);
  }
  if (pathStr.startsWith('api/v1/')) {
    pathStr = pathStr.slice(7);
  }

  const targetBase = pathStr.startsWith('admin-data/') ? origin : apiV1Base;
  return { finalUrl: `${targetBase}/${pathStr}` };
}

export async function serverApiRequest<TResponse, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<TResponse> {
  const method = (config.method || 'GET').toUpperCase();
  const url = config.url || '';

  try {
    const { meta, headers, ...axiosConfig } = config;
    const requiresAuth = meta?.auth === 'required';
    const accessToken = requiresAuth ? await getAccessToken() : undefined;

    if (!API_BASE_URL) {
      const mockResult = await getMockResponse<TResponse>(
        method,
        url,
        config.params as Record<string, unknown>,
        config.data,
      );
      if (mockResult !== null) {
        return mockResult;
      }
    }

    const { finalUrl } = resolveUpstreamUrl(url, API_BASE_URL);

    const response = await axios.request<
      ApiResponse<TResponse>,
      AxiosResponse<ApiResponse<TResponse>>,
      TBody
    >({
      ...axiosConfig,
      url: finalUrl,
      method,
      headers: {
        ...headers,
        Accept: 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    });

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

    if (
      payload &&
      typeof payload === 'object' &&
      'data' in payload &&
      (payload as { data?: unknown }).data !== undefined
    ) {
      return (payload as { data: TResponse }).data;
    }

    return payload as TResponse;
  } catch (error) {
    if (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || !error.response)) {
      const mockFallback = await getMockResponse<TResponse>(
        method,
        url,
        config.params as Record<string, unknown>,
        config.data,
      );
      if (mockFallback !== null) {
        return mockFallback;
      }
    }
    throw normalizeApiError(error);
  }
}

export async function serverApiPaginatedRequest<TItem, TBody = unknown>(
  config: AxiosRequestConfig<TBody>,
): Promise<PaginatedResult<TItem>> {
  const method = (config.method || 'GET').toUpperCase();
  const url = config.url || '';

  try {
    const { meta, headers, ...axiosConfig } = config;
    const requiresAuth = meta?.auth === 'required';
    const accessToken = requiresAuth ? await getAccessToken() : undefined;

    if (!API_BASE_URL) {
      const mockResult = await getMockResponse<PaginatedResult<TItem>>(
        method,
        url,
        config.params as Record<string, unknown>,
        config.data,
      );
      if (mockResult !== null) {
        return mockResult;
      }
    }

    const { finalUrl } = resolveUpstreamUrl(url, API_BASE_URL);

    const response = await axios.request<unknown, AxiosResponse<unknown>, TBody>({
      ...axiosConfig,
      url: finalUrl,
      method,
      headers: {
        ...headers,
        Accept: 'application/json',
        ...(accessToken
          ? {
              Authorization: `Bearer ${accessToken}`,
            }
          : {}),
      },
    });

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
  } catch (error) {
    if (axios.isAxiosError(error) && (error.code === 'ECONNREFUSED' || !error.response)) {
      const mockFallback = await getMockResponse<PaginatedResult<TItem>>(
        method,
        url,
        config.params as Record<string, unknown>,
        config.data,
      );
      if (mockFallback !== null) {
        return mockFallback;
      }
    }
    throw normalizeApiError(error);
  }
}
