import { TELEGRAM_ENDPOINTS } from './_endpoints';
import {
  toTelegramConversationModel,
  toTelegramGroupModel,
  toTelegramMessageModel,
  toTelegramUserModel,
} from './_mappers';
import type {
  TelegramConversationDto,
  TelegramGroupDto,
  TelegramMessageDto,
  TelegramUserDto,
} from './_dto';
import type {
  GetTelegramConversationsParams,
  GetTelegramGroupsParams,
  GetTelegramUsersParams,
} from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type {
  ITelegramConversation,
  ITelegramGroup,
  ITelegramMessage,
  ITelegramUser,
} from '@/models';

export function createTelegramServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getTelegramUsers(
    params?: GetTelegramUsersParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<ITelegramUser>> {
    const result = await paginatedRequest<TelegramUserDto>({
      url: TELEGRAM_ENDPOINTS.users,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toTelegramUserModel),
      meta: result.meta,
    };
  }

  async function getTelegramGroups(
    params?: GetTelegramGroupsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<ITelegramGroup>> {
    const result = await paginatedRequest<TelegramGroupDto>({
      url: TELEGRAM_ENDPOINTS.groups,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toTelegramGroupModel),
      meta: result.meta,
    };
  }

  async function getTelegramConversations(
    params?: GetTelegramConversationsParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<ITelegramConversation>> {
    const result = await paginatedRequest<TelegramConversationDto>({
      url: TELEGRAM_ENDPOINTS.conversations,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toTelegramConversationModel),
      meta: result.meta,
    };
  }

  async function getConversationMessages(
    id: string,
    signal?: AbortSignal,
  ): Promise<ITelegramMessage[]> {
    const res = await request<
      | TelegramMessageDto[]
      | { messages?: TelegramMessageDto[]; data?: { messages?: TelegramMessageDto[] } }
    >({
      url: TELEGRAM_ENDPOINTS.conversationMessages(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    let rawList: TelegramMessageDto[] = [];
    if (Array.isArray(res)) {
      rawList = res;
    } else if (res && typeof res === 'object') {
      const obj = res as Record<string, unknown>;
      if (Array.isArray(obj.messages)) {
        rawList = obj.messages as TelegramMessageDto[];
      } else if (obj.data && typeof obj.data === 'object' && Array.isArray((obj.data as Record<string, unknown>).messages)) {
        rawList = (obj.data as Record<string, unknown>).messages as TelegramMessageDto[];
      } else if (Array.isArray(obj.data)) {
        rawList = obj.data as TelegramMessageDto[];
      } else if (Array.isArray(obj.items)) {
        rawList = obj.items as TelegramMessageDto[];
      }
    }

    return rawList.map(toTelegramMessageModel);
  }

  return {
    getTelegramUsers,
    getTelegramGroups,
    getTelegramConversations,
    getConversationMessages,
  };
}
