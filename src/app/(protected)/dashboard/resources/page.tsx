import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { ResourcesModule } from '@/modules/resources';
import type { Metadata } from 'next';

interface ResourcesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    status?: string;
    kind?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('resources');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  return (
    <RoleGuard permission="resources:read">
      <ResourcesModule searchParams={searchParams} />
    </RoleGuard>
  );
}
