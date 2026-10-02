import { UNIVERSITIES_ENDPOINTS } from './_endpoints';
import { toUniversityModel } from './_mappers';
import type {
  CreateUniversityDto,
  UniversityDto,
  UpdateUniversityDto,
} from './_dto';
import type { GetUniversitiesFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IUniversity } from '@/models';

export function createUniversityServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getUniversities(
    params?: GetUniversitiesFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IUniversity>> {
    const result = await paginatedRequest<UniversityDto>({
      url: UNIVERSITIES_ENDPOINTS.universities,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toUniversityModel),
      meta: result.meta,
    };
  }

  async function getUniversityById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IUniversity> {
    const dto = await request<UniversityDto>({
      url: UNIVERSITIES_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toUniversityModel(dto);
  }

  async function createUniversity(
    payload: CreateUniversityDto,
  ): Promise<IUniversity> {
    const dto = await request<UniversityDto, CreateUniversityDto>({
      url: UNIVERSITIES_ENDPOINTS.universities,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toUniversityModel(dto);
  }

  async function updateUniversity(
    id: string,
    payload: UpdateUniversityDto,
  ): Promise<IUniversity> {
    const dto = await request<UniversityDto, UpdateUniversityDto>({
      url: UNIVERSITIES_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toUniversityModel(dto);
  }

  async function deleteUniversity(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: UNIVERSITIES_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getUniversities,
    getUniversityById,
    createUniversity,
    updateUniversity,
    deleteUniversity,
  };
}
