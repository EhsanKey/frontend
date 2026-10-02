export const QUERY_KEYS = {
  auth: {
    me: ['auth', 'me'] as const,
    roles: ['auth', 'roles'] as const,
    permissions: ['auth', 'permissions'] as const,
    users: ['auth', 'users'] as const,
  },
  analytics: {
    overview: ['analytics', 'overview'] as const,
    professors: (limit?: number) => ['analytics', 'professors', limit] as const,
  },
  reviews: {
    lists: ['reviews', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['reviews', 'list', params] as const,
  },
  registeredReviews: {
    lists: ['registeredReviews', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['registeredReviews', 'list', params] as const,
    detail: (id: string) => ['registeredReviews', 'detail', id] as const,
  },
  resources: {
    lists: ['resources', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['resources', 'list', params] as const,
  },
  professors: {
    lists: ['professors', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['professors', 'list', params] as const,
    relationCounts: (id: string) => ['professors', 'relationCounts', id] as const,
  },
  courses: {
    lists: ['courses', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['courses', 'list', params] as const,
    relationCounts: (id: string) => ['courses', 'relationCounts', id] as const,
  },
  universities: {
    lists: ['universities', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['universities', 'list', params] as const,
  },
  campuses: {
    lists: ['campuses', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['campuses', 'list', params] as const,
  },
  majors: {
    lists: ['majors', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['majors', 'list', params] as const,
  },
  teachings: {
    lists: ['teachings', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['teachings', 'list', params] as const,
  },
  inquiries: {
    lists: ['inquiries', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['inquiries', 'list', params] as const,
    topicsLists: ['inquiries', 'topics'] as const,
    topics: (params?: Record<string, unknown>) => ['inquiries', 'topics', params] as const,
    topicDetails: (id: string) => ['inquiries', 'topic', id] as const,
  },
  errors: {
    lists: ['errors', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['errors', 'list', params] as const,
  },
  items: {
    lists: ['items', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['items', 'list', params] as const,
    details: (id: string | number) => ['items', 'details', String(id)] as const,
  },
  users: {
    lists: ['users', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['users', 'list', params] as const,
  },
  cache: {
    all: ['cache'] as const,
    lists: ['cache', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['cache', 'list', params] as const,
    stats: ['cache', 'stats'] as const,
    detail: (id: string) => ['cache', 'detail', id] as const,
  },
  auditLogs: {
    lists: ['auditLogs', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['auditLogs', 'list', params] as const,
  },
  lookups: {
    all: ['lookups'] as const,
    courses: (params?: Record<string, unknown>) => ['lookups', 'courses', params] as const,
    professors: (params?: Record<string, unknown>) => ['lookups', 'professors', params] as const,
    universities: (params?: Record<string, unknown>) => ['lookups', 'universities', params] as const,
    campuses: (params?: Record<string, unknown>) => ['lookups', 'campuses', params] as const,
    majors: (params?: Record<string, unknown>) => ['lookups', 'majors', params] as const,
    teachings: (params?: Record<string, unknown>) => ['lookups', 'teachings', params] as const,
  },
  broadcasts: {
    all: ['broadcasts'] as const,
    lists: () => ['broadcasts', 'list'] as const,
    list: (params?: Record<string, unknown>) => ['broadcasts', 'list', params] as const,
    detail: (id: string) => ['broadcasts', 'detail', id] as const,
    audienceCount: (params?: Record<string, unknown>) => ['broadcasts', 'audience-count', params] as const,
  },
  dashboard: {
    stats: ['dashboard', 'stats'] as const,
  },
  crawler: {
    channels: ['crawler', 'channels'] as const,
    channelList: (params?: Record<string, unknown>) => ['crawler', 'channels', params] as const,
    folderChannels: ['crawler', 'folderChannels'] as const,
    messages: ['crawler', 'messages'] as const,
    messageList: (params?: Record<string, unknown>) => ['crawler', 'messages', params] as const,
    messageDetail: (id: string) => ['crawler', 'message', id] as const,
  },
  telegram: {
    groupsList: (params?: Record<string, unknown>) => ['telegram', 'groups', params] as const,
    usersList: (params?: Record<string, unknown>) => ['telegram', 'users', params] as const,
    conversationsList: (params?: Record<string, unknown>) => ['telegram', 'conversations', params] as const,
    messagesList: (id: string, params?: Record<string, unknown>) => ['telegram', 'messages', id, params] as const,
  },
} as const;
