import type { ResourceKind, ResourceStatus } from '@/models';

export interface GetResourcesFilterParams {
  status?: ResourceStatus | 'all';
  resourceKind?: ResourceKind | 'all';
  q?: string;
  page?: number;
  pageSize?: number;
  perPage?: number;
}
