export interface BroadcastTargetFiltersDto {
  targetType: 'all' | 'filtered';
  universityId?: string | null;
  campusId?: string | null;
  majorId?: string | null;
  joinedFrom?: string | null;
  joinedTo?: string | null;
}

export interface InlineKeyboardButtonItemDto {
  id: string;
  text: string;
  url: string;
}

export type InlineKeyboardRowDto = InlineKeyboardButtonItemDto[];

export interface BroadcastCampaignDto {
  id: string;
  title: string;
  messageText: string;
  parseMode: string;
  inlineButtons: InlineKeyboardRowDto[];
  targetFilters: BroadcastTargetFiltersDto;
  status: 'draft' | 'sending' | 'completed' | 'partially_failed' | 'failed';
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

export interface BroadcastRecipientDto {
  id: string;
  telegramUserId: string;
  status: 'pending' | 'sent' | 'failed';
  errorMessage?: string | null;
  sentAt?: string | null;
  retryCount: number;
  createdAt: string;
  userFirstName?: string | null;
  userLastName?: string | null;
  userUsername?: string | null;
}

export interface CreateBroadcastDto {
  title: string;
  messageText: string;
  parseMode?: string;
  inlineButtons?: InlineKeyboardRowDto[];
  targetFilters: BroadcastTargetFiltersDto;
}

export interface AudienceCountRequestDto {
  targetFilters: BroadcastTargetFiltersDto;
}

export interface AudienceCountResultDto {
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

export interface BroadcastDetailsDto {
  campaign: BroadcastCampaignDto;
  recipients: {
    items: BroadcastRecipientDto[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface RetryBroadcastResultDto {
  retryingCount: number;
  status: 'sending';
}
