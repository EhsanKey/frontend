import { clientApiPaginatedRequest } from '@/apis/core/client/api-request';
import { createAuditLogServices } from './_services';

export const clientAuditLogServices = createAuditLogServices(
  clientApiPaginatedRequest,
);
