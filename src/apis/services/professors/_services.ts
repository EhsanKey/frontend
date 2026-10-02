import { PROFESSORS_ENDPOINTS } from './_endpoints';
import {
  toProfessorModel,
  toProfessorRelationCountsModel,
} from './_mappers';
import type {
  CreateProfessorDto,
  MergeProfessorDto,
  ProfessorDto,
  ProfessorRelationCountsDto,
  UpdateProfessorDto,
} from './_dto';
import type { GetProfessorsFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IProfessor, IProfessorRelationCounts } from '@/models';

export function createProfessorServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getProfessors(
    params?: GetProfessorsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IProfessor>> {
    const result = await paginatedRequest<ProfessorDto>({
      url: PROFESSORS_ENDPOINTS.professors,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toProfessorModel),
      meta: result.meta,
    };
  }

  async function getProfessorById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IProfessor> {
    const dto = await request<ProfessorDto>({
      url: PROFESSORS_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toProfessorModel(dto);
  }

  async function createProfessor(
    payload: CreateProfessorDto,
  ): Promise<IProfessor> {
    const dto = await request<ProfessorDto, CreateProfessorDto>({
      url: PROFESSORS_ENDPOINTS.professors,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toProfessorModel(dto);
  }

  async function updateProfessor(
    id: string,
    payload: UpdateProfessorDto,
  ): Promise<IProfessor> {
    const dto = await request<ProfessorDto, UpdateProfessorDto>({
      url: PROFESSORS_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toProfessorModel(dto);
  }

  async function deleteProfessor(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: PROFESSORS_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  async function mergeProfessors(
    sourceId: string,
    targetId: string,
  ): Promise<{ merged: boolean; targetId: string; sourceId: string }> {
    return request<{ merged: boolean; targetId: string; sourceId: string }, MergeProfessorDto>({
      url: PROFESSORS_ENDPOINTS.merge(sourceId),
      method: 'POST',
      data: { targetId },
      meta: {
        auth: 'required',
      },
    });
  }

  async function getRelationCounts(
    id: string,
  ): Promise<IProfessorRelationCounts> {
    const dto = await request<ProfessorRelationCountsDto>({
      url: PROFESSORS_ENDPOINTS.relationCounts(id),
      method: 'GET',
      meta: {
        auth: 'required',
      },
    });

    return toProfessorRelationCountsModel(dto);
  }

  return {
    getProfessors,
    getProfessorById,
    createProfessor,
    updateProfessor,
    deleteProfessor,
    mergeProfessors,
    getRelationCounts,
  };
}
