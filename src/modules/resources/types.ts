import type { ResourceKind, ResourceStatus } from '@/models';

export interface ResourcesFilterState {
  status: ResourceStatus | 'all';
  resourceKind: ResourceKind | 'all';
  search: string;
  page: number;
}
