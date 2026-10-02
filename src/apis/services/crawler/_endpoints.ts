export const CRAWLER_ENDPOINTS = {
  channels: '/api/v1/crawler/channels',
  channelDetail: (id: string) => `/api/v1/crawler/channels/${id}`,
  channelSync: (id: string) => `/api/v1/crawler/channels/${id}/sync`,
  channelsSyncAll: '/api/v1/crawler/channels/sync-all',
  folderChannels: '/api/v1/crawler/folder-channels',
  messages: '/api/v1/crawler/messages',
  messageDetail: (id: string) => `/api/v1/crawler/messages/${id}`,
  messageReject: (id: string) => `/api/v1/crawler/messages/${id}/reject`,
  messageApprove: (id: string) => `/api/v1/crawler/messages/${id}/approve`,
  messageBulkDelete: '/api/v1/crawler/messages/bulk-delete',
} as const;
