export const ITEMS_ENDPOINTS = {
  items: '/items',
  itemDetails: (id: string | number) => `/items/${id}` as const,
} as const;
