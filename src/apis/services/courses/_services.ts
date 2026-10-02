import { COURSES_ENDPOINTS } from './_endpoints';
import { toCourseModel, toCourseRelationCountsModel } from './_mappers';
import type {
  CourseDto,
  CourseRelationCountsDto,
  CreateCourseDto,
  MergeCourseDto,
  UpdateCourseDto,
} from './_dto';
import type { GetCoursesFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ICourse, ICourseRelationCounts } from '@/models';

export function createCourseServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getCourses(
    params?: GetCoursesFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<ICourse>> {
    const result = await paginatedRequest<CourseDto>({
      url: COURSES_ENDPOINTS.courses,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toCourseModel),
      meta: result.meta,
    };
  }

  async function getCourseById(
    id: string,
    signal?: AbortSignal,
  ): Promise<ICourse> {
    const dto = await request<CourseDto>({
      url: COURSES_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toCourseModel(dto);
  }

  async function createCourse(payload: CreateCourseDto): Promise<ICourse> {
    const dto = await request<CourseDto, CreateCourseDto>({
      url: COURSES_ENDPOINTS.courses,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toCourseModel(dto);
  }

  async function updateCourse(
    id: string,
    payload: UpdateCourseDto,
  ): Promise<ICourse> {
    const dto = await request<CourseDto, UpdateCourseDto>({
      url: COURSES_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toCourseModel(dto);
  }

  async function deleteCourse(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: COURSES_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  async function mergeCourses(
    sourceId: string,
    targetId: string,
  ): Promise<{ merged: boolean; targetId: string; sourceId: string }> {
    return request<{ merged: boolean; targetId: string; sourceId: string }, MergeCourseDto>({
      url: COURSES_ENDPOINTS.merge(sourceId),
      method: 'POST',
      data: { targetId },
      meta: {
        auth: 'required',
      },
    });
  }

  async function getRelationCounts(id: string): Promise<ICourseRelationCounts> {
    const dto = await request<CourseRelationCountsDto>({
      url: COURSES_ENDPOINTS.relationCounts(id),
      method: 'GET',
      meta: {
        auth: 'required',
      },
    });

    return toCourseRelationCountsModel(dto);
  }

  return {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    mergeCourses,
    getRelationCounts,
  };
}
