export const INQUIRIES_ENDPOINTS = {
  topics: '/admin/inquiries/topics',
  topicDetails: (id: string) => `/admin/inquiries/topics/${id}`,
  updateTopic: (id: string) => `/admin/inquiries/topics/${id}`,
  splitAlias: (topicId: string, aliasId: string) =>
    `/admin/inquiries/topics/${topicId}/aliases/${aliasId}/split`,
  deleteAlias: (topicId: string, aliasId: string) =>
    `/admin/inquiries/topics/${topicId}/aliases/${aliasId}`,
  updateAlias: (topicId: string, aliasId: string) =>
    `/admin/inquiries/topics/${topicId}/aliases/${aliasId}`,
  moveAlias: (topicId: string, aliasId: string) =>
    `/admin/inquiries/topics/${topicId}/aliases/${aliasId}/move`,
  mergeAliases: (topicId: string) =>
    `/admin/inquiries/topics/${topicId}/aliases/merge`,
  deleteTopic: (id: string) => `/admin/inquiries/topics/${id}`,
  bulkDeleteTopics: '/admin/inquiries/topics/bulk-delete',
  mergeTopics: '/admin/inquiries/topics/merge',
  sendCampaign: '/admin/inquiries/campaigns/send',
  eligible: '/admin/inquiries/eligible',
  triggerNotifications: '/admin/inquiries/trigger-notifications',
} as const;
