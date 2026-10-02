import type { IAuditLog } from '@/models';
import type { PaginatedResult } from '@/apis/core/types/api-response';

export type AuditLogColumnKey =
  | 'id'
  | 'timestamp'
  | 'actor'
  | 'domain'
  | 'action'
  | 'entity'
  | 'ip'
  | 'actions';

export interface AuditLogsModuleProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export interface AuditLogsClientProps {
  initialData?: PaginatedResult<IAuditLog>;
}
