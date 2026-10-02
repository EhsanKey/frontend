import { CRAWLER_ENDPOINTS } from './_endpoints';
import type {
  ApproveCrawlerReviewDto,
  CrawlerMessageDto,
  CreateTrackedChannelDto,
  FolderChannelDto,
  RejectCrawlerReviewDto,
  TrackedChannelDto,
  UpdateCrawlerMessageDraftDto,
  UpdateTrackedChannelDto,
} from './_dto';
import type { GetCrawlerMessagesParams, GetTrackedChannelsParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';

export function createCrawlerServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  // 1. Get Tracked Channels
  async function getTrackedChannels(
    params?: GetTrackedChannelsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<TrackedChannelDto>> {
    return await paginatedRequest<TrackedChannelDto>({
      url: CRAWLER_ENDPOINTS.channels,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
  }

  // 2. Get Single Tracked Channel
  async function getTrackedChannelById(
    id: string,
    signal?: AbortSignal,
  ): Promise<TrackedChannelDto> {
    return await request<TrackedChannelDto>({
      url: CRAWLER_ENDPOINTS.channelDetail(id),
      method: 'GET',
      signal,
      meta: { auth: 'required' },
    });
  }

  // 3. Add Tracked Channel
  async function addTrackedChannel(
    payload: CreateTrackedChannelDto,
  ): Promise<TrackedChannelDto> {
    return await request<TrackedChannelDto, CreateTrackedChannelDto>({
      url: CRAWLER_ENDPOINTS.channels,
      method: 'POST',
      data: payload,
      meta: { auth: 'required' },
    });
  }

  // 4. Update Tracked Channel
  async function updateTrackedChannel(
    id: string,
    payload: UpdateTrackedChannelDto,
  ): Promise<TrackedChannelDto> {
    return await request<TrackedChannelDto, UpdateTrackedChannelDto>({
      url: CRAWLER_ENDPOINTS.channelDetail(id),
      method: 'PATCH',
      data: payload,
      meta: { auth: 'required' },
    });
  }

  // 5. Delete Tracked Channel
  async function deleteTrackedChannel(
    id: string,
    options?: { deleteMessages?: boolean },
  ): Promise<{ deleted: boolean; id: string; deleteMessages?: boolean }> {
    return await request<{ deleted: boolean; id: string; deleteMessages?: boolean }>({
      url: CRAWLER_ENDPOINTS.channelDetail(id),
      method: 'DELETE',
      params: options?.deleteMessages !== undefined ? { deleteMessages: options.deleteMessages } : undefined,
      meta: { auth: 'required' },
    });
  }

  // 6. Trigger Channel Sync
  async function triggerChannelSync(id: string): Promise<{ success: boolean; data?: unknown }> {
    return await request<{ success: boolean; data?: unknown }>({
      url: CRAWLER_ENDPOINTS.channelSync(id),
      method: 'POST',
      meta: { auth: 'required' },
    });
  }

  // 6.1 Trigger Sync All Channels
  async function syncAllChannels(): Promise<{ success: boolean; newMessagesCount?: number; message?: string }> {
    return await request<{ success: boolean; newMessagesCount?: number; message?: string }>({
      url: CRAWLER_ENDPOINTS.channelsSyncAll,
      method: 'POST',
      meta: { auth: 'required' },
    });
  }

  // 7. Get Channels from 'uni' Folder
  async function getFolderChannels(signal?: AbortSignal): Promise<FolderChannelDto[]> {
    return await request<FolderChannelDto[]>({
      url: CRAWLER_ENDPOINTS.folderChannels,
      method: 'GET',
      signal,
      meta: { auth: 'required' },
    });
  }

  // 8. Get Crawler Messages
  async function getCrawlerMessages(
    params?: GetCrawlerMessagesParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<CrawlerMessageDto>> {
    return await paginatedRequest<CrawlerMessageDto>({
      url: CRAWLER_ENDPOINTS.messages,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
  }

  // 9. Get Single Crawler Message
  async function getCrawlerMessageById(
    id: string,
    signal?: AbortSignal,
  ): Promise<CrawlerMessageDto> {
    return await request<CrawlerMessageDto>({
      url: CRAWLER_ENDPOINTS.messageDetail(id),
      method: 'GET',
      signal,
      meta: { auth: 'required' },
    });
  }

  // 10. Update Crawler Message Draft
  async function updateCrawlerMessageDraft(
    id: string,
    payload: UpdateCrawlerMessageDraftDto,
  ): Promise<CrawlerMessageDto> {
    return await request<CrawlerMessageDto, UpdateCrawlerMessageDraftDto>({
      url: CRAWLER_ENDPOINTS.messageDetail(id),
      method: 'PATCH',
      data: payload,
      meta: { auth: 'required' },
    });
  }

  // 11. Reject Crawler Review
  async function rejectCrawlerReview(
    id: string,
    payload: RejectCrawlerReviewDto,
  ): Promise<CrawlerMessageDto> {
    return await request<CrawlerMessageDto, RejectCrawlerReviewDto>({
      url: CRAWLER_ENDPOINTS.messageReject(id),
      method: 'POST',
      data: payload,
      meta: { auth: 'required' },
    });
  }

  // 12. Approve Crawler Review
  async function approveCrawlerReview(
    id: string,
    payload: ApproveCrawlerReviewDto,
  ): Promise<unknown> {
    return await request<unknown, ApproveCrawlerReviewDto>({
      url: CRAWLER_ENDPOINTS.messageApprove(id),
      method: 'POST',
      data: payload,
      meta: { auth: 'required' },
    });
  }

  // 13. Delete Single Crawler Message
  async function deleteCrawlerMessage(id: string): Promise<{ deleted: boolean; id: string }> {
    return await request<{ deleted: boolean; id: string }>({
      url: CRAWLER_ENDPOINTS.messageDetail(id),
      method: 'DELETE',
      meta: { auth: 'required' },
    });
  }

  // 14. Bulk Delete Crawler Messages
  async function bulkDeleteCrawlerMessages(ids: string[]): Promise<{ deletedCount: number; ids: string[] }> {
    return await request<{ deletedCount: number; ids: string[] }, { ids: string[] }>({
      url: CRAWLER_ENDPOINTS.messageBulkDelete,
      method: 'POST',
      data: { ids },
      meta: { auth: 'required' },
    });
  }

  return {
    getTrackedChannels,
    getTrackedChannelById,
    addTrackedChannel,
    updateTrackedChannel,
    deleteTrackedChannel,
    triggerChannelSync,
    syncAllChannels,
    getFolderChannels,
    getCrawlerMessages,
    getCrawlerMessageById,
    updateCrawlerMessageDraft,
    rejectCrawlerReview,
    approveCrawlerReview,
    deleteCrawlerMessage,
    bulkDeleteCrawlerMessages,
  };
}
