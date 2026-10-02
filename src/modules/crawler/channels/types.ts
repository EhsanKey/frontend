import type { TrackedChannelStatus } from '@/apis/services/crawler';

export interface CrawlerChannelsFilterState {
  page: number;
  search: string;
  status: TrackedChannelStatus | 'all';
  universityId?: string;
  campusId?: string;
  majorId?: string;
}
