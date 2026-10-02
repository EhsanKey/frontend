import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { ErrorsModule } from '@/modules/errors';
import type { Metadata } from 'next';

interface ErrorsPageProps {
  searchParams: Promise<{
    page?: string;
    search?: string;
    source?: string;
    level?: string;
    isResolved?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('errors');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function ErrorsPage({
  searchParams,
}: ErrorsPageProps) {
  return (
    <RoleGuard permission="errors:read">
      <ErrorsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
