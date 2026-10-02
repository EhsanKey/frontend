export interface GetAuditLogsFilterParams {
  page?: number;
  pageSize?: number;
  action?: string;
  adminUserId?: string;
  adminUsername?: string;
  entityType?: string;
  entityId?: string;
  from?: string;
  to?: string;
  search?: string;
  q?: string;
}
