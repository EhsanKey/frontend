import { REGISTERED_REVIEWS_ENDPOINTS } from './_endpoints';
import { toRegisteredReviewModel } from './_mappers';
import type {
  CreateRegisteredReviewDto,
  RegisteredReviewDto,
  UpdateRegisteredReviewDto,
} from './_dto';
import type { GetRegisteredReviewsFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IRegisteredReview } from '@/models';

export function createRegisteredReviewServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getRegisteredReviews(
    params?: GetRegisteredReviewsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IRegisteredReview>> {
    const result = await paginatedRequest<RegisteredReviewDto>({
      url: REGISTERED_REVIEWS_ENDPOINTS.reviews,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toRegisteredReviewModel),
      meta: result.meta,
    };
  }

  async function getRegisteredReviewById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IRegisteredReview> {
    const dto = await request<RegisteredReviewDto>({
      url: REGISTERED_REVIEWS_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toRegisteredReviewModel(dto);
  }

  async function createRegisteredReview(
    payload: CreateRegisteredReviewDto,
  ): Promise<IRegisteredReview> {
    const dto = await request<RegisteredReviewDto, CreateRegisteredReviewDto>({
      url: REGISTERED_REVIEWS_ENDPOINTS.reviews,
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toRegisteredReviewModel(dto);
  }

  async function updateRegisteredReview(
    id: string,
    payload: UpdateRegisteredReviewDto,
  ): Promise<IRegisteredReview> {
    const dto = await request<RegisteredReviewDto, UpdateRegisteredReviewDto>({
      url: REGISTERED_REVIEWS_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toRegisteredReviewModel(dto);
  }

  async function deleteRegisteredReview(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: REGISTERED_REVIEWS_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getRegisteredReviews,
    getRegisteredReviewById,
    createRegisteredReview,
    updateRegisteredReview,
    deleteRegisteredReview,
  };
}
