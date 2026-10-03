import type { ActivityTrendsDto, AnalyticsOverviewDto, ProfessorAnalyticsDto } from './_dto';
import type { IActivityTrendsResponse, IAnalyticsOverview, IProfessorAnalytics } from '@/models';

export const toAnalyticsOverviewModel = (
  dto: AnalyticsOverviewDto,
): IAnalyticsOverview => ({
  caching: {
    totalEntries: dto.caching?.totalEntries ?? 0,
    totalHits: dto.caching?.totalHits ?? 0,
    estimatedTokensSaved: dto.caching?.estimatedTokensSaved ?? 0,
    hitRatePercentage: dto.caching?.hitRatePercentage ?? 0,
  },
  errors: {
    total: dto.errors?.total ?? 0,
    unresolved: dto.errors?.unresolved ?? 0,
    resolved: dto.errors?.resolved ?? 0,
    today: dto.errors?.today ?? 0,
    bySource: dto.errors?.bySource ?? {
      ai_planner: 0,
      ai_answer: 0,
      system: 0,
    },
    todayBySource: dto.errors?.todayBySource ?? {
      ai_planner: 0,
      ai_answer: 0,
      system: 0,
    },
  },
  submissions: {
    reviews: {
      total: dto.submissions?.reviews?.total ?? 0,
      pending: dto.submissions?.reviews?.pending ?? 0,
      approved: dto.submissions?.reviews?.approved ?? 0,
      rejected: dto.submissions?.reviews?.rejected ?? 0,
      approvalRate: dto.submissions?.reviews?.approvalRate ?? 100,
    },
    resources: {
      total: dto.submissions?.resources?.total ?? 0,
      pending: dto.submissions?.resources?.pending ?? 0,
      approved: dto.submissions?.resources?.approved ?? 0,
      rejected: dto.submissions?.resources?.rejected ?? 0,
      deliveredTokens: dto.submissions?.resources?.deliveredTokens ?? 0,
    },
  },
  inquiries: {
    total: dto.inquiries?.total ?? 0,
    pendingFollowUps: dto.inquiries?.pendingFollowUps ?? 0,
    notifiedFollowUps: dto.inquiries?.notifiedFollowUps ?? 0,
    convertedFollowUps: dto.inquiries?.convertedFollowUps ?? 0,
    optedOutFollowUps: dto.inquiries?.optedOutFollowUps ?? 0,
    round1Pending: dto.inquiries?.round1Pending ?? 0,
    round2Pending: dto.inquiries?.round2Pending ?? 0,
    conversionRate: dto.inquiries?.conversionRate ?? 0,
    byChannel: dto.inquiries?.byChannel ?? {
      private: 0,
      group: 0,
    },
    byType: dto.inquiries?.byType ?? {
      review: 0,
      resource: 0,
    },
  },
  telegram: dto.telegram
    ? {
        totalUsers: dto.telegram.totalUsers ?? 0,
        profileCompletedUsers: dto.telegram.profileCompletedUsers ?? 0,
        totalConversations: dto.telegram.totalConversations ?? 0,
        totalMessages: dto.telegram.totalMessages ?? 0,
        configuredGroups: dto.telegram.configuredGroups ?? 0,
        activeGroups: dto.telegram.activeGroups ?? 0,
      }
    : undefined,
  academic: dto.academic
    ? {
        totalUniversities: dto.academic.totalUniversities ?? 0,
        totalCampuses: dto.academic.totalCampuses ?? 0,
        totalMajors: dto.academic.totalMajors ?? 0,
        totalProfessors: dto.academic.totalProfessors ?? 0,
        totalCourses: dto.academic.totalCourses ?? 0,
        totalTeachings: dto.academic.totalTeachings ?? 0,
        professorsWithReviewsCount: dto.academic.professorsWithReviewsCount ?? 0,
      }
    : undefined,
  aiModels: dto.aiModels
    ? {
        totalModels: dto.aiModels.totalModels ?? 0,
        activeModels: dto.aiModels.activeModels ?? 0,
        totalRequests: dto.aiModels.totalRequests ?? 0,
        totalErrors: dto.aiModels.totalErrors ?? 0,
        overallSuccessRate: dto.aiModels.overallSuccessRate ?? 100,
        todayErrors: dto.aiModels.todayErrors ?? 0,
        models: (dto.aiModels.models ?? []).map((m) => ({
          id: m.id,
          name: m.name,
          providerName: m.providerName,
          model: m.model,
          scope: m.scope,
          status: m.status,
          isEnabled: m.isEnabled,
          requestCount: m.requestCount ?? 0,
          errorCount: m.errorCount ?? 0,
          successRate: m.successRate ?? 100,
          workloadPercentage: m.workloadPercentage ?? 0,
          lastUsedAt: m.lastUsedAt ?? null,
        })),
      }
    : undefined,
  channelUsage: dto.channelUsage
    ? {
        conversations: {
          private: dto.channelUsage.conversations?.private ?? 0,
          group: dto.channelUsage.conversations?.group ?? 0,
        },
        messages: {
          private: dto.channelUsage.messages?.private ?? 0,
          group: dto.channelUsage.messages?.group ?? 0,
        },
        inquiries: {
          private: dto.channelUsage.inquiries?.private ?? 0,
          group: dto.channelUsage.inquiries?.group ?? 0,
        },
        groupTrafficPercentage: dto.channelUsage.groupTrafficPercentage ?? 50,
        privateTrafficPercentage: dto.channelUsage.privateTrafficPercentage ?? 50,
        primaryChannel: dto.channelUsage.primaryChannel ?? 'group',
      }
    : undefined,
  activityTrends: (dto.activityTrends ?? []).map((t) => ({
    date: t.date,
    jalaliDate: t.jalaliDate,
    label: t.label,
    messages: t.messages ?? 0,
    inquiries: t.inquiries ?? 0,
    submissions: t.submissions ?? 0,
  })),
  activityTrendsSummary: dto.activityTrendsSummary
    ? {
        range: dto.activityTrendsSummary.range ?? '7d',
        totalMessages: dto.activityTrendsSummary.totalMessages ?? 0,
        totalInquiries: dto.activityTrendsSummary.totalInquiries ?? 0,
        totalSubmissions: dto.activityTrendsSummary.totalSubmissions ?? 0,
        totalVolume: dto.activityTrendsSummary.totalVolume ?? 0,
      }
    : undefined,
});

export const toActivityTrendsModel = (
  dto: ActivityTrendsDto,
): IActivityTrendsResponse => ({
  range: dto.range ?? '7d',
  points: (dto.points ?? []).map((t) => ({
    date: t.date,
    jalaliDate: t.jalaliDate,
    label: t.label,
    messages: t.messages ?? 0,
    inquiries: t.inquiries ?? 0,
    submissions: t.submissions ?? 0,
  })),
  summary: {
    range: dto.summary?.range ?? dto.range ?? '7d',
    totalMessages: dto.summary?.totalMessages ?? 0,
    totalInquiries: dto.summary?.totalInquiries ?? 0,
    totalSubmissions: dto.summary?.totalSubmissions ?? 0,
    totalVolume: dto.summary?.totalVolume ?? 0,
  },
});

export const toProfessorAnalyticsModel = (
  dto: ProfessorAnalyticsDto,
): IProfessorAnalytics => ({
  topInquired: (dto.topInquired ?? []).map((item) => ({
    professorId: item.professorId,
    professorName: item.professorName,
    inquiryCount: item.inquiryCount ?? 0,
  })),
  missingCoverage: (dto.missingCoverage ?? []).map((item) => ({
    professorId: item.professorId,
    professorName: item.professorName,
    inquiryCount: item.inquiryCount ?? 0,
    reviewCount: item.reviewCount ?? 0,
  })),
});
