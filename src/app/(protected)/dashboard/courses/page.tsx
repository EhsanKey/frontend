import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { CoursesModule } from '@/modules/courses';
import type { Metadata } from 'next';

interface CoursesPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('courses');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function CoursesPage({
  searchParams,
}: CoursesPageProps) {
  return (
    <RoleGuard permission="courses:read">
      <CoursesModule searchParams={searchParams} />
    </RoleGuard>
  );
}
