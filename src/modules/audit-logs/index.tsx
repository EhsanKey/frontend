import { Suspense } from 'react';
import { serverAuditLogServices } from '@/apis/services/audit-logs/server';
import { AuditLogsClient } from './audit-logs-client';
import type { AuditLogsModuleProps } from './types';

export const AuditLogsModule = async ({ searchParams }: AuditLogsModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const pageSize = Number(resolvedParams?.pageSize) || 20;
  const search = typeof resolvedParams?.search === 'string' ? resolvedParams.search : undefined;
  const domain =
    typeof resolvedParams?.domain === 'string' && resolvedParams.domain !== 'all'
      ? resolvedParams.domain
      : undefined;
  const action =
    typeof resolvedParams?.action === 'string' && resolvedParams.action !== 'all'
      ? resolvedParams.action
      : undefined;

  let initialData = undefined;

  try {
    initialData = await serverAuditLogServices.getAuditLogs({
      page,
      pageSize,
      search,
      entityType: domain,
      action,
    });
  } catch {
    // Client fallback
  }

  return (
    <Suspense>
      <AuditLogsClient initialData={initialData} />
    </Suspense>
  );
};

export default AuditLogsModule;
