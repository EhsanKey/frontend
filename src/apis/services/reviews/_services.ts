import { REVIEWS_ENDPOINTS } from './_endpoints';
import { toReviewSubmissionModel } from './_mappers';
import type {
  RejectReviewDto,
  ReviewSubmissionDto,
  UpdateReviewDto,
} from './_dto';
import type { GetReviewsFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IReviewSubmission } from '@/models';

export function createReviewServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getReviews(
    params?: GetReviewsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IReviewSubmission>> {
    const result = await paginatedRequest<ReviewSubmissionDto>({
      url: REVIEWS_ENDPOINTS.submissions,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toReviewSubmissionModel),
      meta: result.meta,
    };
  }

  async function getReviewById(
    id: string,
    signal?: AbortSignal,
  ): Promise<IReviewSubmission> {
    const dto = await request<ReviewSubmissionDto>({
      url: REVIEWS_ENDPOINTS.detail(id),
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toReviewSubmissionModel(dto);
  }

  async function updateReview(
    id: string,
    payload: UpdateReviewDto,
  ): Promise<IReviewSubmission> {
    const dto = await request<ReviewSubmissionDto, UpdateReviewDto>({
      url: REVIEWS_ENDPOINTS.detail(id),
      method: 'PATCH',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toReviewSubmissionModel(dto);
  }

  async function approveReview(id: string): Promise<IReviewSubmission> {
    const dto = await request<ReviewSubmissionDto>({
      url: REVIEWS_ENDPOINTS.approve(id),
      method: 'POST',
      meta: {
        auth: 'required',
      },
    });

    return toReviewSubmissionModel(dto);
  }

  async function rejectReview(
    id: string,
    payload: RejectReviewDto,
  ): Promise<IReviewSubmission> {
    const dto = await request<ReviewSubmissionDto, RejectReviewDto>({
      url: REVIEWS_ENDPOINTS.reject(id),
      method: 'POST',
      data: payload,
      meta: {
        auth: 'required',
      },
    });

    return toReviewSubmissionModel(dto);
  }

  async function deleteReview(id: string): Promise<{ success: boolean }> {
    return request<{ success: boolean }>({
      url: REVIEWS_ENDPOINTS.detail(id),
      method: 'DELETE',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getReviews,
    getReviewById,
    updateReview,
    approveReview,
    rejectReview,
    deleteReview,
  };
}
