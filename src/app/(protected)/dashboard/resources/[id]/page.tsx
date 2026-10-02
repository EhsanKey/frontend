import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { ResourceEditModule } from '@/modules/resources/edit';

interface ResourceEditPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ResourceEditPageProps): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations('resources');

  return {
    title: `${t('modals.editTitle')} #${id} | ${t('meta.title')}`,
    description: t('description'),
  };
}

export default async function ResourceEditPage({ params }: ResourceEditPageProps) {
  const { id } = await params;

  return (
    <RoleGuard permission="resources:update">
      <ResourceEditModule id={id} />
    </RoleGuard>
  );
}
