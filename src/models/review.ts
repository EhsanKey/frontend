import type { ITeaching } from './teaching';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';
export type ReviewSource = 'student' | 'system' | 'admin' | 'telegram_channel';

export interface IRegisteredReviewStudent {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}

export interface IRegisteredReview {
  id: string;
  content: string;
  teachingId: string;
  source: ReviewSource;
  submissionId?: string | null;
  semester?: string | null;
  student?: IRegisteredReviewStudent | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  teaching?: ITeaching;
}

export interface IReviewSubmission {
  id: string;
  professorId?: string | null;
  professorName: string;
  professorIsNew?: boolean;
  courseId?: string | null;
  courseName: string;
  courseIsNew?: boolean;
  studentName?: string;
  universityId?: string;
  universityName?: string;
  campusId?: string;
  campusName?: string;
  majorId?: string | null;
  majorName?: string;
  courseCategory?: 'general' | 'specialized';
  degreeLevels?: string;
  degreeLevelsRaw?: string[];
  content: string;
  semester?: string | null;
  status: ReviewStatus;
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

