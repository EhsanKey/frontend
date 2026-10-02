export const COURSES_ENDPOINTS = {
  courses: '/academic/courses',
  detail: (id: string) => `/academic/courses/${id}`,
  merge: (id: string) => `/academic/courses/${id}/merge`,
  relationCounts: (id: string) => `/academic/courses/${id}/relation-counts`,
} as const;
