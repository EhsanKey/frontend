import type { ISystemPipelineSpec } from '@/models';

export interface GetSystemPipelineParams {
  refresh?: boolean;
}

export interface ISystemPipelineService {
  getMessagePipeline(params?: GetSystemPipelineParams, signal?: AbortSignal): Promise<ISystemPipelineSpec>;
}
