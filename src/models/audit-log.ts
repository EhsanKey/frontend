export interface IAuditLog {
  id: string;
  adminUserId: string;
  adminUsername: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface IAuditLogFilterParams {
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
}
