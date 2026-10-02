export const REGISTERED_REVIEWS_ENDPOINTS = {
  reviews: '/academic/reviews',
  detail: (id: string) => `/academic/reviews/${id}`,
} as const;
