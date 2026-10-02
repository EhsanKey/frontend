import { TEACHINGS_ENDPOINTS } from './_endpoints';
import { toTeachingModel } from './_mappers';
import type {
  CreateTeachingDto,
  TeachingDto,
  UpdateTeachingDto,
} from './_dto';
import type { GetTeachingsFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ITeaching } from '@/models';

export function createTeachingServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getTeachings(
    params?: GetTeachingsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<ITeaching>> {
    const result = await paginatedRequest<TeachingDto>({
      url: TEACHINGS_ENDPOINTS.teachings,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toTeachingModel),
      meta: result.meta,
    };
  }

  async function getTeachingById(
    id: string,
    signal?: AbortSignal,
  ): Promise<ITeaching> {
    const dto = await request<TeachingDto>({
      url: TEACHINGS_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toTeachingModel(dto);
  }

  async function createTeaching(
    payload: CreateTeachingDto,
  ): Promise<ITeaching> {
    const dto = await request<TeachingDto, CreateTeachingDto>({
      url: TEACHINGS_ENDPOINTS.teachings,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toTeachingModel(dto);
  }

  async function updateTeaching(
    id: string,
    payload: UpdateTeachingDto,
  ): Promise<ITeaching> {
    const dto = await request<TeachingDto, UpdateTeachingDto>({
      url: TEACHINGS_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toTeachingModel(dto);
  }

  async function deleteTeaching(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: TEACHINGS_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getTeachings,
    getTeachingById,
    createTeaching,
    updateTeaching,
    deleteTeaching,
  };
}
