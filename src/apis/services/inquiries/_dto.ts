import type {
  InquiryNotificationStatus,
  InquiryTopicStatus,
  InquiryTopicType,
  InquiryType,
} from '@/models';
import type { InlineKeyboardRowDto } from '../broadcasts';

export interface InquiryTopicAliasDto {
  id: string;
  rawAlias: string;
  normalizedAlias: string;
  queryCount: number;
  studentCount?: number;
  createdAt: string;
}

export interface InquiryTopicDto {
  id: string;
  canonicalName: string;
  normalizedCanonicalName: string;
  topicType: InquiryTopicType;
  status: InquiryTopicStatus;
  totalQueries: number;
  uniqueStudentsCount: number;
  pendingInquiriesCount: number;
  sentInquiriesCount: number;
  convertedInquiriesCount: number;
  optedOutInquiriesCount?: number;
  round1PendingCount?: number;
  round2PendingCount?: number;
  conversionRate: number;
  professor?: {
    id: string;
    name: string;
  } | null;
  course?: {
    id: string;
    name: string;
  } | null;
  aliases?: InquiryTopicAliasDto[];
  createdAt: string;
  updatedAt: string;
}

export interface InquiryTopicDetailsDto {
  topic: InquiryTopicDto;
  aliases: InquiryTopicAliasDto[];
  inquiries: Array<{
    id: string;
    aliasId: string | null;
    aliasName: string;
    rawQuery: string | null;
    inquiryType: InquiryType;
    channel: string;
    inquiredAt: string;
    followUpEligibleAt: string;
    notificationStatus: InquiryNotificationStatus;
    notificationSentAt: string | null;
    followUpCount?: number;
    lastFollowUpAt?: string | null;
    optedOutAt?: string | null;
    convertedAt: string | null;
    conversionNote: string | null;
    user: {
      id: string;
      username?: string | null;
      firstName?: string | null;
      lastName?: string | null;
    };
  }>;
}

export interface UpdateInquiryTopicDto {
  canonicalName?: string;
  professorId?: string | null;
  courseId?: string | null;
  status?: InquiryTopicStatus;
}

export interface SplitInquiryAliasDto {
  newCanonicalName?: string;
}

export interface MergeInquiryTopicsDto {
  sourceTopicId: string;
  targetTopicId: string;
}

export interface SendInquiryCampaignDto {
  topicIds?: string[];
  selectedInquiryIds?: string[];
  targetStage?: 'all' | 'round1' | 'round2';
  includeOptOutButton?: boolean;
  limitOnePerUser?: boolean;
  recipientLimitPerTopic?: number;
  messageText: string;
  inlineButtons?: InlineKeyboardRowDto[];
  parseMode?: string;
}

export interface SendInquiryCampaignResultDto {
  totalTarget: number;
  sentCount: number;
  failedCount: number;
}

export interface InquiryFollowUpDto {
  inquiry: {
    id: string;
    telegramUserId: string;
    professorId: string;
    professorName: string;
    courseName: string;
    channel: string;
    telegramChatId: string;
    inquiredAt: string;
    followUpEligibleAt: string;
    notificationStatus: InquiryNotificationStatus;
    notificationSentAt?: string | null;
    followUpCount?: number;
    lastFollowUpAt?: string | null;
    optedOutAt?: string | null;
  };
  user: {
    id: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
  professor: {
    id: string;
    name: string;
  };
  course?: {
    id: string;
    name: string;
  } | null;
}

export interface TriggerNotificationsDto {
  inquiryIds?: string[];
  customMessage?: string;
}

export interface TriggerNotificationsResultDto {
  triggeredCount: number;
  sentInquiryIds: string[];
  failedCount: number;
}

export interface UpdateInquiryAliasDto {
  rawAlias: string;
}

export interface MoveInquiryAliasDto {
  targetTopicId: string;
}

export interface MergeInquiryAliasesDto {
  sourceAliasId: string;
  targetAliasId: string;
}

export interface BulkDeleteInquiryTopicsDto {
  topicIds: string[];
}

export interface BulkDeleteInquiryTopicsResultDto {
  deletedCount: number;
}

