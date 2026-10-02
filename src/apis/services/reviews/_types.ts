import type { ReviewStatus } from '@/models';

export interface GetReviewsFilterParams {
  status?: ReviewStatus | 'all';
  q?: string;
  page?: number;
  pageSize?: number;
  perPage?: number;
  universityId?: string;
  campusId?: string;
  majorId?: string;
  semester?: string;
}
