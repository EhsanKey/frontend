import type { CrawlerMessageStatus } from '@/apis/services/crawler';

export interface CrawlerReviewsFilterState {
  page: number;
  search: string;
  status: CrawlerMessageStatus | 'all';
  confidence?: 'high' | 'medium' | 'low' | 'none' | 'all';
  trackedChannelId?: string;
  universityId?: string;
  campusId?: string;
  majorId?: string;
}
