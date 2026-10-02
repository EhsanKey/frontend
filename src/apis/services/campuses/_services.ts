import { CAMPUSES_ENDPOINTS } from './_endpoints';
import { toCampusModel } from './_mappers';
import type {
  CampusDto,
  CreateCampusDto,
  UpdateCampusDto,
} from './_dto';
import type { GetCampusesFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ICampus } from '@/models';

export function createCampusServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getCampuses(
    params?: GetCampusesFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<ICampus>> {
    const result = await paginatedRequest<CampusDto>({
      url: CAMPUSES_ENDPOINTS.campuses,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toCampusModel),
      meta: result.meta,
    };
  }

  async function getCampusById(
    id: string,
    signal?: AbortSignal,
  ): Promise<ICampus> {
    const dto = await request<CampusDto>({
      url: CAMPUSES_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toCampusModel(dto);
  }

  async function createCampus(
    payload: CreateCampusDto,
  ): Promise<ICampus> {
    const dto = await request<CampusDto, CreateCampusDto>({
      url: CAMPUSES_ENDPOINTS.campuses,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toCampusModel(dto);
  }

  async function updateCampus(
    id: string,
    payload: UpdateCampusDto,
  ): Promise<ICampus> {
    const dto = await request<CampusDto, UpdateCampusDto>({
      url: CAMPUSES_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toCampusModel(dto);
  }

  async function deleteCampus(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: CAMPUSES_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getCampuses,
    getCampusById,
    createCampus,
    updateCampus,
    deleteCampus,
  };
}
