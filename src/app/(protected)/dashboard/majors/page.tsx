import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { MajorsModule } from '@/modules/majors';
import type { Metadata } from 'next';

interface MajorsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('majors');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function MajorsPage({
  searchParams,
}: MajorsPageProps) {
  return (
    <RoleGuard permission="majors:read">
      <MajorsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
