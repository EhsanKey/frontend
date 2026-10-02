import { ERRORS_ENDPOINTS } from './_endpoints';
import { toErrorLogModel } from './_mappers';
import type { ErrorLogDto, ResolveErrorResultDto } from './_dto';
import type { GetErrorsFilterParams } from './_types';
import type {
  ApiPaginatedRequestFunction,
  ApiRequestFunction,
} from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IErrorLog } from '@/models';

export function createErrorServices(
  request: ApiRequestFunction,
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getErrors(
    params?: GetErrorsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IErrorLog>> {
    const result = await paginatedRequest<ErrorLogDto>({
      url: ERRORS_ENDPOINTS.errors,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toErrorLogModel),
      meta: result.meta,
    };
  }

  async function resolveError(id: string): Promise<ResolveErrorResultDto> {
    return request<ResolveErrorResultDto>({
      url: ERRORS_ENDPOINTS.resolve(id),
      method: 'PATCH',
      meta: {
        auth: 'required',
      },
    });
  }

  return {
    getErrors,
    resolveError,
  };
}
