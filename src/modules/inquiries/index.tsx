import { Suspense } from 'react';
import { serverInquiriesServices } from '@/apis/services/inquiries/server';
import { InquiriesClient } from './inquiries-client';

interface InquiriesModuleProps {
  searchParams?: Promise<{
    page?: string;
    onlyEligible?: string;
    tab?: string;
    search?: string;
  }>;
}

export const InquiriesModule = async ({
  searchParams,
}: InquiriesModuleProps) => {
  const resolvedParams = await searchParams;
  const page = Number(resolvedParams?.page) || 1;
  const search = resolvedParams?.search || undefined;
  const onlyEligible =
    resolvedParams?.onlyEligible === 'true'
      ? true
      : resolvedParams?.onlyEligible === 'false'
        ? false
        : undefined;

  let initialTopicsData = undefined;
  let initialEligibleData = undefined;

  try {
    const [topicsRes, eligibleRes] = await Promise.allSettled([
      serverInquiriesServices.getTopics({
        page,
        type: 'professor',
        search,
      }),
      serverInquiriesServices.getEligibleInquiries({
        page,
        onlyEligible,
        search,
      }),
    ]);

    if (topicsRes.status === 'fulfilled') {
      initialTopicsData = topicsRes.value;
    }
    if (eligibleRes.status === 'fulfilled') {
      initialEligibleData = eligibleRes.value;
    }
  } catch {
    // Client fallback handles network / SSR errors
  }

  return (
    <Suspense>
      <InquiriesClient
        initialTopicsData={initialTopicsData}
        initialEligibleData={initialEligibleData}
      />
    </Suspense>
  );
};

export default InquiriesModule;
