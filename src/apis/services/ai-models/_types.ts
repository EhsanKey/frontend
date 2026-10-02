import type { AiModelScope } from '@/models';

export interface GetAiModelsParams {
  scope?: AiModelScope;
  isEnabled?: boolean;
}
