import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { BroadcastCreateModule } from '@/modules/broadcasts/create';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('broadcasts');

  return {
    title: `${t('create.metaTitle')} | ${t('meta.title')}`,
    description: t('meta.description'),
  };
}

export default async function BroadcastCreatePage() {
  return (
    <RoleGuard permission="broadcasts:create">
      <BroadcastCreateModule />
    </RoleGuard>
  );
}
