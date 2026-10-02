export const TEACHINGS_ENDPOINTS = {
  teachings: '/academic/teachings',
  detail: (id: string) => `/academic/teachings/${id}`,
} as const;
