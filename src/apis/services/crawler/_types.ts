import type { TrackedChannelStatus, CrawlerMessageStatus } from './_dto';

export interface GetTrackedChannelsParams {
  page?: number;
  pageSize?: number;
  status?: TrackedChannelStatus | 'all';
  universityId?: string;
  campusId?: string;
  majorId?: string;
  search?: string;
}

export interface GetCrawlerMessagesParams {
  page?: number;
  pageSize?: number;
  status?: CrawlerMessageStatus | 'all';
  trackedChannelId?: string;
  universityId?: string;
  campusId?: string;
  majorId?: string;
  search?: string;
  minPercentage?: number;
  maxPercentage?: number;
  confidence?: 'high' | 'medium' | 'low' | 'none' | 'all';
  isLikelyReview?: boolean;
  matchFilter?: 'exact_100' | 'high_80' | 'ambiguous' | 'low' | 'all';
}
