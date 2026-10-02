export const UNIVERSITIES_ENDPOINTS = {
  universities: '/academic/universities',
  detail: (id: string) => `/academic/universities/${id}`,
} as const;
