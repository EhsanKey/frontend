import type { AuditLogDto } from './_dto';
import type { IAuditLog } from '@/models';

export function toAuditLogModel(dto: AuditLogDto): IAuditLog {
  return {
    id: dto.id,
    adminUserId: dto.adminUserId,
    adminUsername: dto.adminUsername,
    action: dto.action,
    entityType: dto.entityType,
    entityId: dto.entityId,
    details: dto.details || {},
    ipAddress: dto.ipAddress,
    userAgent: dto.userAgent,
    createdAt: dto.createdAt,
  };
}
