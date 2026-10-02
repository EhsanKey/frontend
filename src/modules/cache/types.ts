import type { IAiCacheEntry, IAiCacheStats } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

export interface CacheModuleProps {
  searchParams?: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    intent?: string;
    professorId?: string;
    courseId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export interface CacheClientProps {
  initialEntries?: PaginatedResult<IAiCacheEntry>;
  initialStats?: IAiCacheStats;
}
