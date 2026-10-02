import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { CacheModule } from '@/modules/cache';
import type { Metadata } from 'next';

interface CachePageProps {
  searchParams: Promise<{
    page?: string;
    pageSize?: string;
    search?: string;
    intent?: string;
    professorId?: string;
    courseId?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('cache');
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function CachePage({
  searchParams,
}: CachePageProps) {
  return (
    <RoleGuard permission="cache:read">
      <CacheModule searchParams={searchParams} />
    </RoleGuard>
  );
}
