export const ERRORS_ENDPOINTS = {
  errors: '/admin/errors',
  resolve: (id: string) => `/admin/errors/${id}/resolve`,
} as const;
