import { ANALYTICS_ENDPOINTS } from './_endpoints';
import {
  toAnalyticsOverviewModel,
  toProfessorAnalyticsModel,
} from './_mappers';
import type { AnalyticsOverviewDto, ProfessorAnalyticsDto } from './_dto';
import type { GetProfessorAnalyticsParams } from './_types';
import type { ApiRequestFunction } from '@/apis/core/types/api-request.types';
import type { IAnalyticsOverview, IProfessorAnalytics } from '@/models';

export function createAnalyticsServices(request: ApiRequestFunction) {
  async function getOverview(signal?: AbortSignal): Promise<IAnalyticsOverview> {
    const dto = await request<AnalyticsOverviewDto>({
      url: ANALYTICS_ENDPOINTS.overview,
      method: 'GET',
      signal,
      meta: {
        auth: 'required',
      },
    });

    return toAnalyticsOverviewModel(dto);
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
    getProfessorAnalytics,
  };
}
