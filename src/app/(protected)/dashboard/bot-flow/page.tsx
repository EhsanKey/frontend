import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { BotFlowModule } from '@/modules/bot-flow';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('botFlow');
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function BotFlowPage() {
  return (
    <RoleGuard permission="system_pipeline:read">
      <BotFlowModule />
    </RoleGuard>
  );
}
