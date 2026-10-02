export type BroadcastStatus =
  | 'draft'
  | 'sending'
  | 'completed'
  | 'partially_failed'
  | 'failed';

export type BroadcastRecipientStatus = 'pending' | 'sent' | 'failed';

export interface InlineKeyboardButtonItem {
  id: string;
  text: string;
  url: string;
}

export type InlineKeyboardRow = InlineKeyboardButtonItem[];

export interface BroadcastTargetFilters {
  targetType: 'all' | 'filtered';
  universityId?: string | null;
  campusId?: string | null;
  majorId?: string | null;
  joinedFrom?: string | null;
  joinedTo?: string | null;
}

export interface IBroadcastCampaign {
  id: string;
  title: string;
  messageText: string;
  parseMode: string;
  inlineButtons: InlineKeyboardRow[];
  targetFilters: BroadcastTargetFilters;
  status: BroadcastStatus;
  totalTargets: number;
  successfulCount: number;
  failedCount: number;
  createdByAdminId?: string | null;
  createdByAdminUsername?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IBroadcastRecipient {
  id: string;
  telegramUserId: string;
  status: BroadcastRecipientStatus;
  errorMessage?: string | null;
  sentAt?: string | null;
  retryCount: number;
  createdAt: string;
  userFirstName?: string | null;
  userLastName?: string | null;
  userUsername?: string | null;
}

export interface IBroadcastAudienceCountResult {
  totalCount: number;
  sampleUsers: Array<{
    id: string;
    firstName: string;
    lastName: string | null;
    username: string | null;
    universityName: string | null;
    campusName: string | null;
    majorName: string | null;
    createdAt: string;
  }>;
}

export interface IBroadcastDetailsResponse {
  campaign: IBroadcastCampaign;
  recipients: {
    items: IBroadcastRecipient[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}
