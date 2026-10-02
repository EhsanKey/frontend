import type { ErrorLevel, ErrorSource } from '@/models';

export interface GetErrorsFilterParams {
  source?: ErrorSource | 'all';
  level?: ErrorLevel | 'all';
  isResolved?: boolean | 'all';
  search?: string;
  q?: string;
  limit?: number;
  offset?: number;
  page?: number;
  pageSize?: number;
  perPage?: number;
}
