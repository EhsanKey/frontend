export interface AnalyticsOverviewDto {
  caching: {
    totalEntries: number;
    totalHits: number;
    estimatedTokensSaved: number;
    hitRatePercentage?: number;
  };
  errors: {
    total: number;
    unresolved: number;
    resolved?: number;
    today?: number;
    bySource?: {
      ai_planner: number;
      ai_answer: number;
      system: number;
    };
    todayBySource?: {
      ai_planner: number;
      ai_answer: number;
      system: number;
    };
  };
  submissions: {
    reviews: {
      total: number;
      pending: number;
      approved: number;
      rejected?: number;
      approvalRate?: number;
    };
    resources: {
      total: number;
      pending: number;
      approved: number;
      rejected?: number;
      deliveredTokens?: number;
    };
  };
  inquiries: {
    total: number;
    pendingFollowUps: number;
    notifiedFollowUps?: number;
    convertedFollowUps?: number;
    optedOutFollowUps?: number;
    round1Pending?: number;
    round2Pending?: number;
    conversionRate?: number;
    byChannel?: {
      private: number;
      group: number;
    };
    byType?: {
      review: number;
      resource: number;
    };
  };
  telegram?: {
    totalUsers: number;
    profileCompletedUsers: number;
    totalConversations: number;
    totalMessages: number;
    configuredGroups: number;
    activeGroups: number;
  };
  academic?: {
    totalUniversities: number;
    totalCampuses: number;
    totalMajors: number;
    totalProfessors: number;
    totalCourses: number;
    totalTeachings: number;
    professorsWithReviewsCount: number;
  };
  aiModels?: {
    totalModels: number;
    activeModels: number;
    totalRequests: number;
    totalErrors: number;
    overallSuccessRate: number;
    todayErrors: number;
    models: Array<{
      id: string;
      name: string;
      providerName: string;
      model: string;
      scope: string;
      status: string;
      isEnabled: boolean;
      requestCount: number;
      errorCount: number;
      successRate: number;
      workloadPercentage: number;
      lastUsedAt?: string | null;
    }>;
  };
  channelUsage?: {
    conversations: {
      private: number;
      group: number;
    };
    messages: {
      private: number;
      group: number;
    };
    inquiries: {
      private: number;
      group: number;
    };
    groupTrafficPercentage: number;
    privateTrafficPercentage: number;
    primaryChannel: 'group' | 'private';
  };
  activityTrends?: Array<{
    date: string;
    messages: number;
    inquiries: number;
    submissions: number;
  }>;
}

export interface ProfessorAnalyticsDto {
  topInquired: Array<{
    professorId: string;
    professorName: string;
    inquiryCount: number;
  }>;
  missingCoverage: Array<{
    professorId: string;
    professorName: string;
    inquiryCount: number;
    reviewCount: number;
  }>;
}
