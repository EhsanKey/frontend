import { BROADCASTS_ENDPOINTS } from './_endpoints';
import {
  toBroadcastCampaignModel,
  toBroadcastDetailsModel,
  toAudienceCountResultModel,
} from './_mappers';
import type {
  BroadcastCampaignDto,
  BroadcastDetailsDto,
  CreateBroadcastDto,
  AudienceCountRequestDto,
  AudienceCountResultDto,
  RetryBroadcastResultDto,
} from './_dto';
import type { GetBroadcastsFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type {
  IBroadcastCampaign,
  IBroadcastDetailsResponse,
  IBroadcastAudienceCountResult,
} from '@/models';

export function createBroadcastsServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getBroadcasts(
    params?: GetBroadcastsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IBroadcastCampaign>> {
    const result = await paginatedRequest<BroadcastCampaignDto>({
      url: BROADCASTS_ENDPOINTS.list,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toBroadcastCampaignModel),
      meta: result.meta,
    };
  }

  async function getBroadcastDetails(
    id: string,
    params?: { page?: number; pageSize?: number; status?: string },
    signal?: AbortSignal,
  ): Promise<IBroadcastDetailsResponse> {
    const result = await request<BroadcastDetailsDto>({
      url: BROADCASTS_ENDPOINTS.detail(id),
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toBroadcastDetailsModel(result);
  }

  async function createBroadcast(
    payload: CreateBroadcastDto,
  ): Promise<IBroadcastCampaign> {
    const result = await request<BroadcastCampaignDto, CreateBroadcastDto>({
      url: BROADCASTS_ENDPOINTS.create,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toBroadcastCampaignModel(result);
  }

  async function calculateAudienceCount(
    payload: AudienceCountRequestDto,
  ): Promise<IBroadcastAudienceCountResult> {
    const result = await request<AudienceCountResultDto, AudienceCountRequestDto>({
      url: BROADCASTS_ENDPOINTS.audienceCount,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toAudienceCountResultModel(result);
  }

  async function retryFailedBroadcast(
    id: string,
  ): Promise<RetryBroadcastResultDto> {
    return request<RetryBroadcastResultDto>({
      url: BROADCASTS_ENDPOINTS.retry(id),
      method: 'POST',
      meta: {
        auth: 'required',
      },
    });
  }

  async function deleteBroadcast(
    id: string,
  ): Promise<{ id: string; deleted: boolean }> {
    return request<{ id: string; deleted: boolean }>({
      url: BROADCASTS_ENDPOINTS.delete(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getBroadcasts,
    getBroadcastDetails,
    createBroadcast,
    calculateAudienceCount,
    retryFailedBroadcast,
    deleteBroadcast,
  };
}
