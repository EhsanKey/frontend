import { AI_CACHE_ENDPOINTS } from './_endpoints';
import type {
  AiCacheEntryDto,
  AiCacheStatsDto,
  AiCacheInvalidateDto,
  AiCacheInvalidateResult,
  AiCacheFlushResult,
} from './_dto';
import type { GetAiCacheParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IAiCacheEntry, IAiCacheStats } from '@/models';

export function createAiCacheServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getCacheEntries(
    params?: GetAiCacheParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IAiCacheEntry>> {
    return paginatedRequest<IAiCacheEntry>({
      url: AI_CACHE_ENDPOINTS.list,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
  }

  async function getCacheStats(
    signal?: AbortSignal,
  ): Promise<IAiCacheStats> {
    return request<AiCacheStatsDto>({
      url: AI_CACHE_ENDPOINTS.stats,
      method: 'GET',
      signal,
      meta: { auth: 'required' },
    });
  }

  async function getCacheEntryById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IAiCacheEntry> {
    return request<AiCacheEntryDto>({
      url: AI_CACHE_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: { auth: 'required' },
    });
  }

  async function deleteCacheEntry(
    id: string,
  ): Promise<{ id: string; deleted: boolean }> {
    return request<{ id: string; deleted: boolean }>({
      url: AI_CACHE_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: { auth: 'required' },
    });
  }

  async function invalidateCache(
    payload: AiCacheInvalidateDto,
  ): Promise<AiCacheInvalidateResult> {
    return request<AiCacheInvalidateResult, AiCacheInvalidateDto>({
      url: AI_CACHE_ENDPOINTS.invalidate,
      method: 'POST',
      data: payload,
      meta: { auth: 'required' },
    });
  }

  async function flushCache(): Promise<AiCacheFlushResult> {
    return request<AiCacheFlushResult>({
      url: AI_CACHE_ENDPOINTS.list,
      method: 'DELETE',
      meta: { auth: 'required' },
    });
  }

  return {
    getCacheEntries,
    getCacheStats,
    getCacheEntryById,
    deleteCacheEntry,
    invalidateCache,
    flushCache,
  };
}
