import { RESOURCES_ENDPOINTS } from './_endpoints';
import { toResourceSubmissionModel } from './_mappers';
import type {
  RejectResourceDto,
  ResourceSubmissionDto,
  UpdateResourceDto,
} from './_dto';
import type { GetResourcesFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IResourceSubmission } from '@/models';

export function createResourceServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getResources(
    params?: GetResourcesFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IResourceSubmission>> {
    const result = await paginatedRequest<ResourceSubmissionDto>({
      url: RESOURCES_ENDPOINTS.submissions,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toResourceSubmissionModel),
      meta: result.meta,
    };
  }

  async function getResourceById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IResourceSubmission> {
    const dto = await request<ResourceSubmissionDto>({
      url: RESOURCES_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toResourceSubmissionModel(dto);
  }

  async function updateResource(
    id: string,
    payload: UpdateResourceDto,
  ): Promise<IResourceSubmission> {
    const dto = await request<ResourceSubmissionDto, UpdateResourceDto>({
      url: RESOURCES_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toResourceSubmissionModel(dto);
  }

  async function approveResource(id: string): Promise<IResourceSubmission> {
    const dto = await request<ResourceSubmissionDto>({
      url: RESOURCES_ENDPOINTS.approve(id),
      method: 'POST',
      meta: {
        auth: 'required',
      },
    });

    return toResourceSubmissionModel(dto);
  }

  async function rejectResource(
    id: string,
    payload: RejectResourceDto,
  ): Promise<IResourceSubmission> {
    const dto = await request<ResourceSubmissionDto, RejectResourceDto>({
      url: RESOURCES_ENDPOINTS.reject(id),
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toResourceSubmissionModel(dto);
  }

  async function deleteResource(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: RESOURCES_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getResources,
    getResourceById,
    updateResource,
    approveResource,
    rejectResource,
    deleteResource,
  };
}
