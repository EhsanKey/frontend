export const USERS_ENDPOINTS = {
  users: '/auth/users',
  detail: (id: string | number) => `/auth/users/${id}`,
  roles: '/auth/roles',
  permissions: '/auth/permissions',
} as const;
