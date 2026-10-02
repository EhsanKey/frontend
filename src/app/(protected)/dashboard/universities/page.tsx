import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { UniversitiesModule } from '@/modules/universities';
import type { Metadata } from 'next';

interface UniversitiesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('universities');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function UniversitiesPage({
  searchParams,
}: UniversitiesPageProps) {
  return (
    <RoleGuard permission="universities:read">
      <UniversitiesModule searchParams={searchParams} />
    </RoleGuard>
  );
}
