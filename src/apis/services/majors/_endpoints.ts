export const MAJORS_ENDPOINTS = {
  majors: '/academic/majors',
  detail: (id: string) => `/academic/majors/${id}`,
} as const;
