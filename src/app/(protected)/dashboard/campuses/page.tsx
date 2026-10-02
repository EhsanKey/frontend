import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { CampusesModule } from '@/modules/campuses';
import type { Metadata } from 'next';

interface CampusesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    universityId?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('campuses');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function CampusesPage({
  searchParams,
}: CampusesPageProps) {
  return (
    <RoleGuard permission="campuses:read">
      <CampusesModule searchParams={searchParams} />
    </RoleGuard>
  );
}
