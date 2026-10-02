export const TELEGRAM_ENDPOINTS = {
  users: '/telegram/users',
  userDetail: (id: string) => `/telegram/users/${id}`,
  groups: '/telegram/groups',
  groupDetail: (id: string) => `/telegram/groups/${id}`,
  conversations: '/telegram/conversations',
  conversationMessages: (id: string) => `/telegram/conversations/${id}/messages`,
} as const;
