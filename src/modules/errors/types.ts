import type { ErrorLevel, ErrorSource } from '@/models';

export interface ErrorsFilterState {
  source: ErrorSource | 'all';
  level: ErrorLevel | 'all';
  isResolved: 'all' | 'true' | 'false';
  search: string;
  page: number;
}
