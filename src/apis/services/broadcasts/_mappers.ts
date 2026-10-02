import type {
  IBroadcastCampaign,
  IBroadcastRecipient,
  IBroadcastAudienceCountResult,
  IBroadcastDetailsResponse,
} from '@/models';
import type {
  BroadcastCampaignDto,
  BroadcastRecipientDto,
  AudienceCountResultDto,
  BroadcastDetailsDto,
} from './_dto';

export function toBroadcastCampaignModel(dto: BroadcastCampaignDto): IBroadcastCampaign {
  return {
    id: dto.id,
    title: dto.title,
    messageText: dto.messageText,
    parseMode: dto.parseMode || 'HTML',
    inlineButtons: Array.isArray(dto.inlineButtons) ? dto.inlineButtons : [],
    targetFilters: {
      targetType: dto.targetFilters?.targetType || 'all',
      universityId: dto.targetFilters?.universityId ?? null,
      campusId: dto.targetFilters?.campusId ?? null,
      majorId: dto.targetFilters?.majorId ?? null,
      joinedFrom: dto.targetFilters?.joinedFrom ?? null,
      joinedTo: dto.targetFilters?.joinedTo ?? null,
    },
    status: dto.status || 'draft',
    totalTargets: dto.totalTargets ?? 0,
    successfulCount: dto.successfulCount ?? 0,
    failedCount: dto.failedCount ?? 0,
    createdByAdminId: dto.createdByAdminId ?? null,
    createdByAdminUsername: dto.createdByAdminUsername ?? null,
    startedAt: dto.startedAt ?? null,
    completedAt: dto.completedAt ?? null,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}

export function toBroadcastRecipientModel(dto: BroadcastRecipientDto): IBroadcastRecipient {
  return {
    id: dto.id,
    telegramUserId: dto.telegramUserId,
    status: dto.status || 'pending',
    errorMessage: dto.errorMessage ?? null,
    sentAt: dto.sentAt ?? null,
    retryCount: dto.retryCount ?? 0,
    createdAt: dto.createdAt,
    userFirstName: dto.userFirstName ?? null,
    userLastName: dto.userLastName ?? null,
    userUsername: dto.userUsername ?? null,
  };
}

export function toAudienceCountResultModel(dto: AudienceCountResultDto): IBroadcastAudienceCountResult {
  return {
    totalCount: dto.totalCount ?? 0,
    sampleUsers: Array.isArray(dto.sampleUsers)
      ? dto.sampleUsers.map((u) => ({
          id: u.id,
          firstName: u.firstName || '',
          lastName: u.lastName ?? null,
          username: u.username ?? null,
          universityName: u.universityName ?? null,
          campusName: u.campusName ?? null,
          majorName: u.majorName ?? null,
          createdAt: u.createdAt,
        }))
      : [],
  };
}

export function toBroadcastDetailsModel(dto: BroadcastDetailsDto): IBroadcastDetailsResponse {
  return {
    campaign: toBroadcastCampaignModel(dto.campaign),
    recipients: {
      items: Array.isArray(dto.recipients?.items)
        ? dto.recipients.items.map(toBroadcastRecipientModel)
        : [],
      total: dto.recipients?.total ?? 0,
      page: dto.recipients?.page ?? 1,
      pageSize: dto.recipients?.pageSize ?? 20,
      totalPages: dto.recipients?.totalPages ?? 1,
    },
  };
}
