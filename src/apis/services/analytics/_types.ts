import type { AnalyticsTimeRange } from '@/models';

export type { AnalyticsTimeRange };

export interface GetOverviewParams {
  range?: AnalyticsTimeRange;
}

export interface GetActivityTrendsParams {
  range?: AnalyticsTimeRange;
}

export interface GetProfessorAnalyticsParams {
  limit?: number;
}
