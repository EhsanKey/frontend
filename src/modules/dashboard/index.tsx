import { Suspense } from 'react';
import { serverAnalyticsServices } from '@/apis/services/analytics/server';
import { DashboardClient } from './dashboard-client';

export const DashboardModule = async () => {
  let initialOverview = undefined;
  let initialProfessors = undefined;

  try {
    initialOverview = await serverAnalyticsServices.getOverview();
    initialProfessors = await serverAnalyticsServices.getProfessorAnalytics({ limit: 6 });
  } catch {
    // Graceful fallback to client fetching if server fetch fails
  }

  return (
    <Suspense>
      <DashboardClient
        initialOverview={initialOverview}
        initialProfessors={initialProfessors}
      />
    </Suspense>
  );
};

export default DashboardModule;
