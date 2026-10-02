import type {
  InquiryFollowUpDto,
  InquiryTopicDetailsDto,
  InquiryTopicDto,
} from './_dto';
import type {
  IInquiryFollowUpItem,
  IInquiryTopic,
  IInquiryTopicDetails,
} from '@/models';

export const toInquiryTopicModel = (dto: InquiryTopicDto): IInquiryTopic => ({
  id: dto.id,
  canonicalName: dto.canonicalName,
  normalizedCanonicalName: dto.normalizedCanonicalName,
  topicType: dto.topicType,
  status: dto.status,
  totalQueries: dto.totalQueries ?? 1,
  uniqueStudentsCount: dto.uniqueStudentsCount ?? 0,
  pendingInquiriesCount: dto.pendingInquiriesCount ?? 0,
  sentInquiriesCount: dto.sentInquiriesCount ?? 0,
  convertedInquiriesCount: dto.convertedInquiriesCount ?? 0,
  optedOutInquiriesCount: dto.optedOutInquiriesCount ?? 0,
  round1PendingCount: dto.round1PendingCount ?? 0,
  round2PendingCount: dto.round2PendingCount ?? 0,
  conversionRate: dto.conversionRate ?? 0,
  professor: dto.professor
    ? {
        id: dto.professor.id,
        name: dto.professor.name,
      }
    : null,
  course: dto.course
    ? {
        id: dto.course.id,
        name: dto.course.name,
      }
    : null,
  aliases: (dto.aliases ?? []).map((a) => ({
    id: a.id,
    rawAlias: a.rawAlias,
    normalizedAlias: a.normalizedAlias,
    queryCount: a.queryCount ?? 1,
    studentCount: a.studentCount ?? 0,
    createdAt: a.createdAt,
  })),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});

export const toInquiryTopicDetailsModel = (
  dto: InquiryTopicDetailsDto,
): IInquiryTopicDetails => ({
  topic: toInquiryTopicModel(dto.topic),
  aliases: (dto.aliases ?? []).map((a) => ({
    id: a.id,
    rawAlias: a.rawAlias,
    normalizedAlias: a.normalizedAlias,
    queryCount: a.queryCount ?? 1,
    studentCount: a.studentCount ?? 0,
    createdAt: a.createdAt,
  })),
  inquiries: (dto.inquiries ?? []).map((i) => ({
    id: i.id,
    aliasId: i.aliasId ?? null,
    aliasName: i.aliasName || i.rawQuery || '—',
    rawQuery: i.rawQuery ?? null,
    inquiryType: i.inquiryType,
    channel: i.channel,
    inquiredAt: i.inquiredAt,
    followUpEligibleAt: i.followUpEligibleAt,
    notificationStatus: i.notificationStatus,
    notificationSentAt: i.notificationSentAt ?? null,
    followUpCount: i.followUpCount ?? 0,
    lastFollowUpAt: i.lastFollowUpAt ?? null,
    optedOutAt: i.optedOutAt ?? null,
    convertedAt: i.convertedAt ?? null,
    conversionNote: i.conversionNote ?? null,
    user: {
      id: i.user?.id || '',
      username: i.user?.username ?? null,
      firstName: i.user?.firstName ?? null,
      lastName: i.user?.lastName ?? null,
    },
  })),
});

export const toInquiryFollowUpModel = (
  dto: InquiryFollowUpDto,
): IInquiryFollowUpItem => ({
  id: dto.inquiry.id,
  inquiry: {
    id: dto.inquiry.id,
    telegramUserId: dto.inquiry.telegramUserId,
    professorId: dto.inquiry.professorId,
    professorName: dto.inquiry.professorName,
    courseName: dto.inquiry.courseName,
    channel: dto.inquiry.channel,
    telegramChatId: dto.inquiry.telegramChatId,
    inquiredAt: dto.inquiry.inquiredAt,
    followUpEligibleAt: dto.inquiry.followUpEligibleAt,
    notificationStatus: dto.inquiry.notificationStatus,
    notificationSentAt: dto.inquiry.notificationSentAt,
    followUpCount: dto.inquiry.followUpCount ?? 0,
    lastFollowUpAt: dto.inquiry.lastFollowUpAt ?? null,
    optedOutAt: dto.inquiry.optedOutAt ?? null,
  },
  user: {
    id: dto.user.id,
    username: dto.user.username,
    firstName: dto.user.firstName,
    lastName: dto.user.lastName,
  },
  professor: {
    id: dto.professor.id,
    name: dto.professor.name,
  },
  course: dto.course
    ? {
        id: dto.course.id,
        name: dto.course.name,
      }
    : null,
});
