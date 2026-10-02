import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { ProfessorsModule } from '@/modules/professors';
import type { Metadata } from 'next';

interface ProfessorsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('professors');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function ProfessorsPage({
  searchParams,
}: ProfessorsPageProps) {
  return (
    <RoleGuard permission="professors:read">
      <ProfessorsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
