import { LOOKUPS_ENDPOINTS } from './_endpoints';
import {
  toCampusLookupModel,
  toLookupModel,
  toTeachingLookupModel,
} from './_mappers';
import type {
  CampusLookupItemDto,
  LookupItemDto,
  TeachingLookupItemDto,
} from './_dto';
import type {
  CampusLookupQueryParams,
  LookupQueryParams,
} from './_types';
import type {
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type {
  ICampusLookupItem,
  ILookupItem,
  ITeachingLookupItem,
} from '@/models';

export function createLookupServices(request: ApiRequestFunction) {
  async function lookupUniversities(
    params?: LookupQueryParams,
    signal?: AbortSignal,
  ): Promise<ILookupItem[]> {
    const list = await request<LookupItemDto[]>({
      url: LOOKUPS_ENDPOINTS.universities,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
    return Array.isArray(list) ? list.map(toLookupModel) : [];
  }

  async function lookupCampuses(
    params?: CampusLookupQueryParams,
    signal?: AbortSignal,
  ): Promise<ICampusLookupItem[]> {
    const list = await request<CampusLookupItemDto[]>({
      url: LOOKUPS_ENDPOINTS.campuses,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
    return Array.isArray(list) ? list.map(toCampusLookupModel) : [];
  }

  async function lookupMajors(
    params?: LookupQueryParams,
    signal?: AbortSignal,
  ): Promise<ILookupItem[]> {
    const list = await request<LookupItemDto[]>({
      url: LOOKUPS_ENDPOINTS.majors,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
    return Array.isArray(list) ? list.map(toLookupModel) : [];
  }

  async function lookupProfessors(
    params?: LookupQueryParams,
    signal?: AbortSignal,
  ): Promise<ILookupItem[]> {
    const list = await request<LookupItemDto[]>({
      url: LOOKUPS_ENDPOINTS.professors,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
    return Array.isArray(list) ? list.map(toLookupModel) : [];
  }

  async function lookupCourses(
    params?: LookupQueryParams,
    signal?: AbortSignal,
  ): Promise<ILookupItem[]> {
    const list = await request<LookupItemDto[]>({
      url: LOOKUPS_ENDPOINTS.courses,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
    return Array.isArray(list) ? list.map(toLookupModel) : [];
  }

  async function lookupTeachings(
    params?: LookupQueryParams,
    signal?: AbortSignal,
  ): Promise<ITeachingLookupItem[]> {
    const list = await request<TeachingLookupItemDto[]>({
      url: LOOKUPS_ENDPOINTS.teachings,
      method: 'GET',
      params,
      signal,
      meta: { auth: 'required' },
    });
    return Array.isArray(list) ? list.map(toTeachingLookupModel) : [];
  }

  return {
    lookupUniversities,
    lookupCampuses,
    lookupMajors,
    lookupProfessors,
    lookupCourses,
    lookupTeachings,
  };
}
