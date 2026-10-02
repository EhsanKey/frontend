import { INQUIRIES_ENDPOINTS } from './_endpoints';
import {
  toInquiryFollowUpModel,
  toInquiryTopicDetailsModel,
  toInquiryTopicModel,
} from './_mappers';
import type {
  BulkDeleteInquiryTopicsDto,
  BulkDeleteInquiryTopicsResultDto,
  InquiryFollowUpDto,
  InquiryTopicAliasDto,
  InquiryTopicDetailsDto,
  InquiryTopicDto,
  MergeInquiryAliasesDto,
  MergeInquiryTopicsDto,
  MoveInquiryAliasDto,
  SendInquiryCampaignDto,
  SendInquiryCampaignResultDto,
  SplitInquiryAliasDto,
  TriggerNotificationsDto,
  TriggerNotificationsResultDto,
  UpdateInquiryAliasDto,
  UpdateInquiryTopicDto,
} from './_dto';
import type {
  GetInquiriesFilterParams,
  GetInquiryTopicsFilterParams,
} from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { ApiResponse, PaginatedResult } from '@/apis/core/types/api-response';
import type {
  IInquiryFollowUpItem,
  IInquiryTopic,
  IInquiryTopicDetails,
} from '@/models';

export function createInquiriesServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getTopics(
    params?: GetInquiryTopicsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IInquiryTopic>> {
    const result = await paginatedRequest<InquiryTopicDto>({
      url: INQUIRIES_ENDPOINTS.topics,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toInquiryTopicModel),
      meta: result.meta,
    };
  }

  async function getTopicDetails(
    id: string,
    signal?: AbortSignal,
  ): Promise<IInquiryTopicDetails> {
    const result = await request<ApiResponse<InquiryTopicDetailsDto>>({
      url: INQUIRIES_ENDPOINTS.topicDetails(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    const data = (result as any)?.data || result;
    return toInquiryTopicDetailsModel(data as InquiryTopicDetailsDto);
  }

  async function updateTopic(
    id: string,
    data: UpdateInquiryTopicDto,
  ): Promise<IInquiryTopic> {
    const result = await request<ApiResponse<InquiryTopicDto>, UpdateInquiryTopicDto>({
      url: INQUIRIES_ENDPOINTS.updateTopic(id),
      method: 'PATCH',
      data,
      meta: {
        auth: 'required',
      },
    });

    const topicData = (result as any)?.data || result;
    return toInquiryTopicModel(topicData as InquiryTopicDto);
  }

  async function splitAlias(
    topicId: string,
    aliasId: string,
    data?: SplitInquiryAliasDto,
  ): Promise<IInquiryTopic> {
    const result = await request<ApiResponse<InquiryTopicDto>, SplitInquiryAliasDto>({
      url: INQUIRIES_ENDPOINTS.splitAlias(topicId, aliasId),
      method: 'POST',
      data,
      meta: {
        auth: 'required',
      },
    });

    const topicData = (result as any)?.data || result;
    return toInquiryTopicModel(topicData as InquiryTopicDto);
  }

  async function deleteAlias(
    topicId: string,
    aliasId: string,
  ): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>({
      url: INQUIRIES_ENDPOINTS.deleteAlias(topicId, aliasId),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  async function mergeTopics(
    data: MergeInquiryTopicsDto,
  ): Promise<{ merged: boolean }> {
    return request<{ merged: boolean }, MergeInquiryTopicsDto>({
      url: INQUIRIES_ENDPOINTS.mergeTopics,
      method: 'POST',
      data,
      meta: {
        auth: 'required',
      },
    });
  }

  async function sendCampaign(
    data: SendInquiryCampaignDto,
  ): Promise<SendInquiryCampaignResultDto> {
    const result = await request<ApiResponse<SendInquiryCampaignResultDto>, SendInquiryCampaignDto>({
      url: INQUIRIES_ENDPOINTS.sendCampaign,
      method: 'POST',
      data,
      meta: {
        auth: 'required',
      },
    });

    return ((result as any)?.data || result) as SendInquiryCampaignResultDto;
  }

  async function getEligibleInquiries(
    params?: GetInquiriesFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IInquiryFollowUpItem>> {
    const result = await paginatedRequest<InquiryFollowUpDto>({
      url: INQUIRIES_ENDPOINTS.eligible,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toInquiryFollowUpModel),
      meta: result.meta,
    };
  }

  async function triggerNotifications(
    payload?: TriggerNotificationsDto,
  ): Promise<TriggerNotificationsResultDto> {
    return request<TriggerNotificationsResultDto, TriggerNotificationsDto>({
      url: INQUIRIES_ENDPOINTS.triggerNotifications,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });
  }

  async function updateAlias(
    topicId: string,
    aliasId: string,
    data: UpdateInquiryAliasDto,
  ): Promise<InquiryTopicAliasDto> {
    const result = await request<ApiResponse<InquiryTopicAliasDto>, UpdateInquiryAliasDto>({
      url: INQUIRIES_ENDPOINTS.updateAlias(topicId, aliasId),
      method: 'PATCH',
      data,
      meta: {
        auth: 'required',
      },
    });

    return ((result as any)?.data || result) as InquiryTopicAliasDto;
  }

  async function moveAlias(
    topicId: string,
    aliasId: string,
    data: MoveInquiryAliasDto,
  ): Promise<{ moved: boolean }> {
    return request<{ moved: boolean }, MoveInquiryAliasDto>({
      url: INQUIRIES_ENDPOINTS.moveAlias(topicId, aliasId),
      method: 'POST',
      data,
      meta: {
        auth: 'required',
      },
    });
  }

  async function mergeAliases(
    topicId: string,
    data: MergeInquiryAliasesDto,
  ): Promise<{ merged: boolean }> {
    return request<{ merged: boolean }, MergeInquiryAliasesDto>({
      url: INQUIRIES_ENDPOINTS.mergeAliases(topicId),
      method: 'POST',
      data,
      meta: {
        auth: 'required',
      },
    });
  }

  async function deleteTopic(id: string): Promise<{ deleted: boolean }> {
    return request<{ deleted: boolean }>({
      url: INQUIRIES_ENDPOINTS.deleteTopic(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  async function bulkDeleteTopics(
    data: BulkDeleteInquiryTopicsDto,
  ): Promise<BulkDeleteInquiryTopicsResultDto> {
    const result = await request<ApiResponse<BulkDeleteInquiryTopicsResultDto>, BulkDeleteInquiryTopicsDto>({
      url: INQUIRIES_ENDPOINTS.bulkDeleteTopics,
      method: 'POST',
      data,
      meta: {
        auth: 'required',
      },
    });

    return ((result as any)?.data || result) as BulkDeleteInquiryTopicsResultDto;
  }

  return {
    getTopics,
    getTopicDetails,
    updateTopic,
    deleteTopic,
    bulkDeleteTopics,
    splitAlias,
    deleteAlias,
    updateAlias,
    moveAlias,
    mergeAliases,
    mergeTopics,
    sendCampaign,
    getEligibleInquiries,
    triggerNotifications,
  };
}
