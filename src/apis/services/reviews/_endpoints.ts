export const REVIEWS_ENDPOINTS = {
  submissions: '/moderation/reviews',
  detail: (id: string) => `/moderation/reviews/${id}`,
  approve: (id: string) => `/moderation/reviews/${id}/approve`,
  reject: (id: string) => `/moderation/reviews/${id}/reject`,
  delete: (id: string) => `/moderation/reviews/${id}`,
} as const;
