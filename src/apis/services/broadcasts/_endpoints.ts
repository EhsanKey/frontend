export const BROADCASTS_ENDPOINTS = {
  list: '/admin/broadcasts',
  create: '/admin/broadcasts',
  audienceCount: '/admin/broadcasts/audience-count',
  detail: (id: string) => `/admin/broadcasts/${id}` as const,
  retry: (id: string) => `/admin/broadcasts/${id}/retry` as const,
  delete: (id: string) => `/admin/broadcasts/${id}` as const,
} as const;
