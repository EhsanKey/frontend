import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { BroadcastsModule } from '@/modules/broadcasts';
import type { Metadata } from 'next';

interface BroadcastsPageProps {
  searchParams: Promise<{
    page?: string;
    status?: string;
    search?: string;
  }>;
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('broadcasts');
  return {
    title: t('meta.title'),
    description: t('description'),
  };
}

export default async function BroadcastsPage({
  searchParams,
}: BroadcastsPageProps) {
  return (
    <RoleGuard permission="broadcasts:read">
      <BroadcastsModule searchParams={searchParams} />
    </RoleGuard>
  );
}
