import { serverApiPaginatedRequest } from '@/apis/core/server/api-request';
import { createAuditLogServices } from './_services';

export const serverAuditLogServices = createAuditLogServices(
  serverApiPaginatedRequest,
);
