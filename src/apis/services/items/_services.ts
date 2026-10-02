import { ITEMS_ENDPOINTS } from './_endpoints';
import { toItemModel } from './_mappers';
import type {
  CreateItemRequest,
  GetItemsFilterParams,
  ItemResult,
  UpdateItemRequest,
} from './_types';
import type { CreateItemDto, ItemDto, UpdateItemDto } from './_dto';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';

export function createItemServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getItems(
    params?: GetItemsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<ItemResult>> {
    const result = await paginatedRequest<ItemDto>({
      url: ITEMS_ENDPOINTS.items,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toItemModel),
      meta: result.meta,
    };
  }

  async function getItemById(
    id: number | string,
    signal?: AbortSignal,
  ): Promise<ItemResult> {
    const dto = await request<ItemDto>({
      url: ITEMS_ENDPOINTS.itemDetails(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toItemModel(dto);
  }

  async function createItem(payload: CreateItemRequest): Promise<ItemResult> {
    const dto = await request<ItemDto, CreateItemDto>({
      url: ITEMS_ENDPOINTS.items,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toItemModel(dto);
  }

  async function updateItem(
    id: number | string,
    payload: UpdateItemRequest,
  ): Promise<ItemResult> {
    const dto = await request<ItemDto, UpdateItemDto>({
      url: ITEMS_ENDPOINTS.itemDetails(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toItemModel(dto);
  }

  async function deleteItem(id: number | string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: ITEMS_ENDPOINTS.itemDetails(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
  };
}
