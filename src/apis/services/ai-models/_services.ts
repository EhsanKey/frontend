import { AI_MODELS_ENDPOINTS } from './_endpoints';
import { toAiModelConfigModel } from './_mappers';
import type {
  AiModelDto,
  CreateAiModelDto,
  UpdateAiModelDto,
} from './_dto';
import type { GetAiModelsParams } from './_types';
import type { ApiRequestFunction } from '@/apis/core/types/api-request.types';
import type { IAiModelConfig } from '@/models';

export function createAiModelServices(request: ApiRequestFunction) {
  async function getAiModels(
    params?: GetAiModelsParams,
    signal?: AbortSignal,
  ): Promise<IAiModelConfig[]> {
    const data = await request<AiModelDto[]>({
      url: AI_MODELS_ENDPOINTS.models,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return (Array.isArray(data) ? data : []).map(toAiModelConfigModel);
  }

  async function getAiModelById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IAiModelConfig> {
    const dto = await request<AiModelDto>({
      url: AI_MODELS_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toAiModelConfigModel(dto);
  }

  async function createAiModel(
    payload: CreateAiModelDto,
  ): Promise<IAiModelConfig> {
    const dto = await request<AiModelDto, CreateAiModelDto>({
      url: AI_MODELS_ENDPOINTS.models,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toAiModelConfigModel(dto);
  }

  async function updateAiModel(
    id: string,
    payload: UpdateAiModelDto,
  ): Promise<IAiModelConfig> {
    const dto = await request<AiModelDto, UpdateAiModelDto>({
      url: AI_MODELS_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toAiModelConfigModel(dto);
  }

  async function deleteAiModel(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: AI_MODELS_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getAiModels,
    getAiModelById,
    createAiModel,
    updateAiModel,
    deleteAiModel,
  };
}
