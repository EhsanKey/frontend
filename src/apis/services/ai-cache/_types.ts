export interface GetAiCacheParams {
  page?: number;
  pageSize?: number;
  search?: string;
  q?: string;
  professorId?: string;
  courseId?: string;
  intent?: string;
  sortBy?: 'hitCount' | 'updatedAt' | 'createdAt' | 'lastHitAt' | string;
  sortOrder?: 'asc' | 'desc' | string;
}
