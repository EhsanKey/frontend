import { MAJORS_ENDPOINTS } from './_endpoints';
import { toMajorModel } from './_mappers';
import type {
  CreateMajorDto,
  MajorDto,
  UpdateMajorDto,
} from './_dto';
import type { GetMajorsFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IMajor } from '@/models';

export function createMajorServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getMajors(
    params?: GetMajorsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IMajor>> {
    const result = await paginatedRequest<MajorDto>({
      url: MAJORS_ENDPOINTS.majors,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toMajorModel),
      meta: result.meta,
    };
  }

  async function getMajorById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IMajor> {
    const dto = await request<MajorDto>({
      url: MAJORS_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toMajorModel(dto);
  }

  async function createMajor(
    payload: CreateMajorDto,
  ): Promise<IMajor> {
    const dto = await request<MajorDto, CreateMajorDto>({
      url: MAJORS_ENDPOINTS.majors,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toMajorModel(dto);
  }

  async function updateMajor(
    id: string,
    payload: UpdateMajorDto,
  ): Promise<IMajor> {
    const dto = await request<MajorDto, UpdateMajorDto>({
      url: MAJORS_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toMajorModel(dto);
  }

  async function deleteMajor(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: MAJORS_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getMajors,
    getMajorById,
    createMajor,
    updateMajor,
    deleteMajor,
  };
}
