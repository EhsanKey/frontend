import type { AiModelDto } from './_dto';
import type { IAiModelConfig } from '@/models';

export const toAiModelConfigModel = (dto: AiModelDto): IAiModelConfig => ({
  id: dto.id,
  name: dto.name,
  scope: dto.scope,
  providerName: dto.providerName,
  baseUrl: dto.baseUrl,
  apiKeyMasked:
    dto.apiKeyMasked ||
    (dto.apiKey ? `${dto.apiKey.slice(0, 4)}...${dto.apiKey.slice(-4)}` : '••••••••'),
  model: dto.model,
  structuredOutputMode: dto.structuredOutputMode || 'json_schema',
  maxTokensParameter: dto.maxTokensParameter || 'max_tokens',
  requireParameters: Boolean(dto.requireParameters),
  includeTemperature: Boolean(dto.includeTemperature),
  isEnabled: Boolean(dto.isEnabled),
  status: dto.status || (dto.isEnabled ? 'active' : 'disabled'),
  limitedUntil: dto.limitedUntil || null,
  lastError: dto.lastError || null,
  lastUsedAt: dto.lastUsedAt || null,
  requestCount: dto.requestCount ?? 0,
  errorCount: dto.errorCount ?? 0,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
