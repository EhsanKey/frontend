export const AI_CACHE_ENDPOINTS = {
  list: '/api/v1/ai-cache',
  stats: '/api/v1/ai-cache/stats',
  detail: (id: string) => `/api/v1/ai-cache/${id}` as const,
  invalidate: '/api/v1/ai-cache/invalidate',
} as const;
