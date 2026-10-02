export const RESOURCES_ENDPOINTS = {
  submissions: '/moderation/resources',
  detail: (id: string) => `/moderation/resources/${id}`,
  approve: (id: string) => `/moderation/resources/${id}/approve`,
  reject: (id: string) => `/moderation/resources/${id}/reject`,
  delete: (id: string) => `/moderation/resources/${id}`,
} as const;
