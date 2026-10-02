export type AiModelScope = 'plan' | 'answer' | 'shared' | string;

export interface IAiModelConfig {
  id: string;
  name: string;
  scope: AiModelScope;
  providerName: string;
  baseUrl: string;
  apiKeyMasked: string;
  model: string;
  structuredOutputMode: string;
  maxTokensParameter: string;
  requireParameters: boolean;
  includeTemperature: boolean;
  isEnabled: boolean;
  status?: 'active' | 'disabled' | 'limited' | string;
  limitedUntil?: string | null;
  lastError?: string | null;
  lastUsedAt?: string | null;
  requestCount?: number;
  errorCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
