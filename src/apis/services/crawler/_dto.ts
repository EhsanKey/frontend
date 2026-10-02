import type { DegreeLevel } from '@/models';

export type TrackedChannelStatus = 'active' | 'paused' | 'error';
export type BackfillStatus = 'idle' | 'in_progress' | 'completed' | 'failed';
export type CrawlerMessageStatus = 'pending' | 'approved' | 'rejected' | 'ignored';

export interface TrackedChannelDto {
  id: string;
  telegramChannelId: string;
  accessHash?: string | null;
  title: string;
  username?: string | null;
  inviteLink?: string | null;
  isPrivate: boolean;
  sourceFolder?: string | null;
  universityId: string;
  universityName?: string;
  campusId: string;
  campusName?: string;
  majorId?: string | null;
  majorName?: string | null;
  syncHistorical: boolean;
  status: TrackedChannelStatus;
  backfillStatus: BackfillStatus;
  oldestMessageId?: number | null;
  latestMessageId?: number | null;
  totalMessagesCollected: number;
  detectedReviewsCount?: number;
  approvedReviewsCount?: number;
  pendingReviewsCount?: number;
  errorMessage?: string | null;
  lastSyncAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewEvaluationMeta {
  percentage: number;
  probability: number;
  isLikelyReview: boolean;
  confidence: 'high' | 'medium' | 'low' | 'none';
  detectedDimensions: string[];
  matchedKeywords?: string[];
  finalState?: string;
  score?: number;
  executionTimeMs?: number;
}

export interface ExtractedCourseOptionDto {
  rawName: string;
  courseName: string;
  courseResolution: {
    matchedId: string | null;
    matchedName: string | null;
    score: number;
    isExactMatch: boolean;
    confidence: 'high' | 'medium' | 'low';
    isCatalogMatch: boolean;
  };
}

export interface ReviewEvaluationDimensionsDto {
  examType?: string | null;
  research?: string | null;
  presentation?: string | null;
  attendance?: string | null;
  midterm?: string | null;
  examSource?: string | null;
  gradingQuality?: string | null;
}

export interface CrawlerExtractionMeta {
  professorName: string | null;
  rawProfessorName?: string | null;
  courseName: string | null;
  rawCourseName?: string | null;
  additionalCourses?: ExtractedCourseOptionDto[];
  allExtractedCourses?: ExtractedCourseOptionDto[];
  evaluationDimensions?: ReviewEvaluationDimensionsDto;
  professorResolution?: {
    matchedId: string | null;
    matchedName: string | null;
    score: number;
    isExactMatch: boolean;
    confidence: 'high' | 'medium' | 'low';
  };
  courseResolution?: {
    matchedId: string | null;
    matchedName: string | null;
    score: number;
    isExactMatch: boolean;
    confidence: 'high' | 'medium' | 'low';
    isCatalogMatch: boolean;
  };
  hasCleanReviewSynthesized?: boolean;
}

export interface EntityResolutionDto {
  matchedId?: string | null;
  matchedName?: string | null;
  score?: number;
  matchType?: string;
  isExactMatch?: boolean;
  confidence?: 'high' | 'medium' | 'low';
  isCatalogMatch?: boolean;
}

export interface FolderChannelDto {
  telegramChannelId: string;
  accessHash?: string | null;
  title: string;
  username?: string | null;
  inviteLink?: string | null;
  isPrivate: boolean;
  participantsCount?: number;
  alreadyTracked?: boolean;
}

export interface CrawlerMessageDto {
  id: string;
  trackedChannelId: string;
  channelTitle?: string;
  channelUsername?: string | null;
  channelIsPrivate?: boolean;
  telegramChannelId: string;
  telegramMessageId: number;
  content: string;
  authorName?: string | null;
  messageDate: string;
  rawMetadata?: {
    reviewEvaluation?: ReviewEvaluationMeta;
    extraction?: CrawlerExtractionMeta;
    [key: string]: unknown;
  } | null;
  status: CrawlerMessageStatus;
  rejectionReason?: string | null;

  universityId: string;
  universityName?: string;
  campusId: string;
  campusName?: string;
  majorId?: string | null;
  majorName?: string | null;

  professorId?: string | null;
  professorName?: string | null;
  existingProfessorName?: string | null;
  courseId?: string | null;
  courseName?: string | null;
  existingCourseName?: string | null;
  teachingId?: string | null;
  degreeLevel?: string | null;
  semester?: string | null;

  approvedReviewId?: string | null;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTrackedChannelDto {
  telegramChannelId?: string;
  accessHash?: string | null;
  username?: string | null;
  title: string;
  inviteLink?: string | null;
  isPrivate?: boolean;
  sourceFolder?: string | null;
  universityId: string;
  campusId: string;
  majorId?: string | null;
  syncHistorical?: boolean;
}

export interface UpdateTrackedChannelDto {
  title?: string;
  status?: TrackedChannelStatus;
  campusId?: string;
  majorId?: string | null;
  syncHistorical?: boolean;
  errorMessage?: string | null;
}

export interface UpdateCrawlerMessageDraftDto {
  content?: string;
  universityId?: string;
  campusId?: string;
  majorId?: string | null;
  professorId?: string | null;
  professorName?: string;
  courseId?: string | null;
  courseName?: string;
  degreeLevel?: string;
  semester?: string;
}

export interface AdditionalCourseDto {
  courseId?: string | null;
  courseName: string;
  isNew?: boolean;
}

export interface ApproveCrawlerReviewDto {
  universityId: string;
  campusId: string;
  majorId?: string | null;
  courseCategory?: 'general' | 'specialized';

  professorId?: string | null;
  professorName: string;
  professorIsNew?: boolean;

  courseId?: string | null;
  courseName: string;
  courseIsNew?: boolean;

  additionalCourses?: AdditionalCourseDto[];

  degreeLevel: DegreeLevel;
  semester?: string | null;

  content: string;
}

export interface RejectCrawlerReviewDto {
  reason?: string | null;
}
