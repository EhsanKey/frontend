import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { RoleGuard } from '@/components/shared';
import { InquiriesCampaignClient } from '@/modules/inquiries/inquiries-campaign';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('inquiries');

  return {
    title: `${t('campaign.title')} | ${t('meta.title')}`,
    description: t('description'),
  };
}

export default async function InquiriesCampaignPage() {
  return (
    <RoleGuard permission="inquiries:trigger">
      <InquiriesCampaignClient />
    </RoleGuard>
  );
}
