import type { ReviewStatus } from '@/models';

export interface ReviewsFilterState {
  status: ReviewStatus | 'all';
  search: string;
  page: number;
}
