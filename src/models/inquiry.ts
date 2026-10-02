export type InquiryNotificationStatus = 'pending' | 'sent' | 'converted' | 'ignored' | 'failed' | 'opted_out';
export type InquiryTopicType = 'professor' | 'course';
export type InquiryTopicStatus = 'active' | 'resolved' | 'archived';
export type InquiryType = 'review' | 'resource';
export type InquiryFollowUpStage = 'all' | 'round1' | 'round2';

export interface IInquiryAlias {
  id: string;
  rawAlias: string;
  normalizedAlias: string;
  queryCount: number;
  studentCount?: number;
  createdAt: string;
}

export interface IInquiryTopic {
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
  aliases: IInquiryAlias[];
  createdAt: string;
  updatedAt: string;
}

export interface IInquiryUser {
  id: string;
  username?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export interface IInquiryTopicInquiryItem {
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
  user: IInquiryUser;
}

export interface IInquiryTopicDetails {
  topic: IInquiryTopic;
  aliases: IInquiryAlias[];
  inquiries: IInquiryTopicInquiryItem[];
}

export interface IInquiryDetails {
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
}

export interface IInquiryFollowUpItem {
  id: string;
  inquiry: IInquiryDetails;
  user: IInquiryUser;
  professor: {
    id: string;
    name: string;
  };
  course?: {
    id: string;
    name: string;
  } | null;
}
