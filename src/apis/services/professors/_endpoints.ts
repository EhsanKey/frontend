export const PROFESSORS_ENDPOINTS = {
  professors: '/academic/professors',
  detail: (id: string) => `/academic/professors/${id}`,
  merge: (id: string) => `/academic/professors/${id}/merge`,
  relationCounts: (id: string) => `/academic/professors/${id}/relation-counts`,
} as const;
