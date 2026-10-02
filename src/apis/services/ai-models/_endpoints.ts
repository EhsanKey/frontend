export const AI_MODELS_ENDPOINTS = {
  models: '/ai-models',
  detail: (id: string) => `/ai-models/${id}`,
} as const;
