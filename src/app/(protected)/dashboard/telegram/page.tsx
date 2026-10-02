import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { TelegramModule } from '@/modules/telegram';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('telegram');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function TelegramPage() {
  return (
    <RoleGuard permission="groups:read">
      <TelegramModule />
    </RoleGuard>
  );
}
