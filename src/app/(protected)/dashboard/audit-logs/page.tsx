import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { AuditLogsModule } from '@/modules';
import type { Metadata } from 'next';

type AuditLogsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('auditLogs');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  return (
    <RoleGuard permission="audit_logs:read">
      <AuditLogsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
