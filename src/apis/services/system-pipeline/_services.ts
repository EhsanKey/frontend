import { SYSTEM_PIPELINE_ENDPOINTS } from './_endpoints';
import { toSystemPipelineModel } from './_mappers';
import type { SystemPipelineDto } from './_dto';
import type { GetSystemPipelineParams, ISystemPipelineService } from './_types';
import type { ApiRequestFunction } from '@/apis/core/types/api-request.types';
import type { ISystemPipelineSpec } from '@/models';

export function createSystemPipelineServices(
  request: ApiRequestFunction,
): ISystemPipelineService {
  async function getMessagePipeline(
    params?: GetSystemPipelineParams,
    signal?: AbortSignal,
  ): Promise<ISystemPipelineSpec> {
    const res = await request<SystemPipelineDto | { data: SystemPipelineDto }>({
      url: SYSTEM_PIPELINE_ENDPOINTS.messagePipeline,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'none',
      },
    });

    const rawDto: SystemPipelineDto =
      res && typeof res === 'object' && 'data' in res && res.data
        ? (res.data as SystemPipelineDto)
        : (res as SystemPipelineDto);

    return toSystemPipelineModel(rawDto);
  }

  return {
    getMessagePipeline,
  };
}
