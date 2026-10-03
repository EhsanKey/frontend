import { ANALYTICS_ENDPOINTS } from './_endpoints';
import {
  toActivityTrendsModel,
  toAnalyticsOverviewModel,
  toProfessorAnalyticsModel,
} from './_mappers';
import type { ActivityTrendsDto, AnalyticsOverviewDto, ProfessorAnalyticsDto } from './_dto';
import type {
  GetActivityTrendsParams,
  GetOverviewParams,
  GetProfessorAnalyticsParams,
} from './_types';
import type { ApiRequestFunction } from '@/apis/core/types/api-request.types';
import type {
  IActivityTrendsResponse,
  IAnalyticsOverview,
  IProfessorAnalytics,
} from '@/models';

export function createAnalyticsServices(request: ApiRequestFunction) {
  async function getOverview(
    params?: GetOverviewParams,
    signal?: AbortSignal,
  ): Promise<IAnalyticsOverview> {
    const dto = await request<AnalyticsOverviewDto>({
      url: ANALYTICS_ENDPOINTS.overview,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toAnalyticsOverviewModel(dto);
  }

  async function getActivityTrends(
    params?: GetActivityTrendsParams,
    signal?: AbortSignal,
  ): Promise<IActivityTrendsResponse> {
    const dto = await request<ActivityTrendsDto>({
      url: ANALYTICS_ENDPOINTS.activityTrends,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toActivityTrendsModel(dto);
  }

  async function getProfessorAnalytics(
    params?: GetProfessorAnalyticsParams,
    signal?: AbortSignal,
  ): Promise<IProfessorAnalytics> {
    const dto = await request<ProfessorAnalyticsDto>({
      url: ANALYTICS_ENDPOINTS.professors,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toProfessorAnalyticsModel(dto);
  }

  return {
    getOverview,
    getActivityTrends,
    getProfessorAnalytics,
  };
}
