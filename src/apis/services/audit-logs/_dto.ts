export interface AuditLogDto {
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
