export interface ICachingAnalytics {
  totalEntries: number;
  totalHits: number;
  estimatedTokensSaved: number;
  hitRatePercentage?: number;
}

export interface IErrorAnalytics {
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
}

export interface ISubmissionsAnalytics {
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
}

export interface IInquiriesAnalytics {
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
}

export interface ITelegramAnalytics {
  totalUsers: number;
  profileCompletedUsers: number;
  totalConversations: number;
  totalMessages: number;
  configuredGroups: number;
  activeGroups: number;
}

export interface IAcademicAnalytics {
  totalUniversities: number;
  totalCampuses: number;
  totalMajors: number;
  totalProfessors: number;
  totalCourses: number;
  totalTeachings: number;
  professorsWithReviewsCount: number;
}

export interface IAIModelTelemetry {
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
}

export interface IAIModelsAnalytics {
  totalModels: number;
  activeModels: number;
  totalRequests: number;
  totalErrors: number;
  overallSuccessRate: number;
  todayErrors: number;
  models: IAIModelTelemetry[];
}

export interface IChannelUsageAnalytics {
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
}

export type AnalyticsTimeRange = '24h' | '7d' | '30d' | '1y';

export interface IActivityTrendPoint {
  date: string;
  jalaliDate?: string;
  label?: string;
  messages: number;
  inquiries: number;
  submissions: number;
}

export interface IActivityTrendsSummary {
  range: AnalyticsTimeRange;
  totalMessages: number;
  totalInquiries: number;
  totalSubmissions: number;
  totalVolume: number;
}

export interface IActivityTrendsResponse {
  range: AnalyticsTimeRange;
  points: IActivityTrendPoint[];
  summary: IActivityTrendsSummary;
}

export interface IAnalyticsOverview {
  caching: ICachingAnalytics;
  errors: IErrorAnalytics;
  submissions: ISubmissionsAnalytics;
  inquiries: IInquiriesAnalytics;
  telegram?: ITelegramAnalytics;
  academic?: IAcademicAnalytics;
  aiModels?: IAIModelsAnalytics;
  channelUsage?: IChannelUsageAnalytics;
  activityTrends?: IActivityTrendPoint[];
  activityTrendsSummary?: IActivityTrendsSummary;
}

export interface ITopInquiredProfessor {
  professorId: string;
  professorName: string;
  inquiryCount: number;
}

export interface IMissingCoverageProfessor {
  professorId: string;
  professorName: string;
  inquiryCount: number;
  reviewCount: number;
}

export interface IProfessorAnalytics {
  topInquired: ITopInquiredProfessor[];
  missingCoverage: IMissingCoverageProfessor[];
}
