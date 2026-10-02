export const CAMPUSES_ENDPOINTS = {
  campuses: '/academic/campuses',
  detail: (id: string) => `/academic/campuses/${id}`,
} as const;
