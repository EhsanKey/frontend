import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { AiModelsModule } from '@/modules/ai-models';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('aiModels');
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function AiModelsPage() {
  return (
    <RoleGuard permission="ai_models:read">
      <AiModelsModule />
    </RoleGuard>
  );
}
