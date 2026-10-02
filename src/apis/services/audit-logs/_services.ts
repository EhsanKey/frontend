import { AUDIT_LOGS_ENDPOINTS } from './_endpoints';
import { toAuditLogModel } from './_mappers';
import type { AuditLogDto } from './_dto';
import type { GetAuditLogsFilterParams } from './_types';
import type { ApiPaginatedRequestFunction } from '@/apis/core/types/api-request.types';
import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IAuditLog } from '@/models';

export function createAuditLogServices(
  paginatedRequest: ApiPaginatedRequestFunction,
) {
  async function getAuditLogs(
    params?: GetAuditLogsFilterParams,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<IAuditLog>> {
    const result = await paginatedRequest<AuditLogDto>({
      url: AUDIT_LOGS_ENDPOINTS.list,
      method: 'GET',
      params,
      signal,
      meta: {
        auth: 'required',
      },
    });

    return {
      items: result.items.map(toAuditLogModel),
      meta: result.meta,
    };
  }

  return {
    getAuditLogs,
  };
}
