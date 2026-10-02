import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { TeachingsModule } from '@/modules/teachings';
import type { Metadata } from 'next';

interface TeachingsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    professorId?: string;
    courseId?: string;
    degreeLevel?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('teachings');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function TeachingsPage({
  searchParams,
}: TeachingsPageProps) {
  return (
    <RoleGuard permission="teachings:read">
      <TeachingsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
