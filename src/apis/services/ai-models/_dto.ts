import type { AiModelScope } from '@/models';

export interface AiModelDto {
  id: string;
  name: string;
  scope: AiModelScope;
  providerName: string;
  baseUrl: string;
  apiKeyMasked?: string;
  apiKey?: string;
  model: string;
  structuredOutputMode: string;
  maxTokensParameter: string;
  requireParameters: boolean;
  includeTemperature: boolean;
  isEnabled: boolean;
  status?: string;
  limitedUntil?: string | null;
  lastError?: string | null;
  lastUsedAt?: string | null;
  requestCount?: number;
  errorCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAiModelDto {
  name: string;
  scope: AiModelScope;
  providerName: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  structuredOutputMode?: string;
  maxTokensParameter?: string;
  requireParameters?: boolean;
  includeTemperature?: boolean;
  isEnabled?: boolean;
}

export interface UpdateAiModelDto {
  name?: string;
  scope?: AiModelScope;
  providerName?: string;
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  structuredOutputMode?: string;
  maxTokensParameter?: string;
  requireParameters?: boolean;
  includeTemperature?: boolean;
  isEnabled?: boolean;
}
