import type { ReviewStatus } from '@/models';

export interface ReviewSubmissionDto {
  id: string;
  content: string;
  status: ReviewStatus;
  rejectionReason?: string | null;
  semester?: string | null;
  createdAt: string;
  updatedAt?: string | null;
  degreeLevels?: string | string[];
  courseCategory?: string;

  // Nested domain objects (v1.1.0 standard)
  professor?: { id: string; name: string; isNew?: boolean };
  course?: { id: string; name: string; isNew?: boolean };
  user?: {
    id?: string;
    displayName?: string;
    username?: string;
    firstName?: string;
    lastName?: string;
  };
  university?: { id?: string; name?: string };
  campus?: { id?: string; name?: string };
  major?: { id?: string; name?: string };

  // Flat fields (legacy fallback)
  professorId?: string;
  professorName?: string;
  existingProfessorName?: string;
  courseId?: string;
  courseName?: string;
  existingCourseName?: string;
  studentName?: string;
  userDisplayName?: string;
  universityName?: string;
  campusName?: string;
  majorName?: string;
}

export interface UpdateReviewDto {
  universityId?: string;
  campusId?: string;
  majorId?: string | null;
  courseCategory?: 'general' | 'specialized';
  professorId?: string | null;
  professorName?: string;
  professorIsNew?: boolean;
  courseId?: string | null;
  courseName?: string;
  courseIsNew?: boolean;
  degreeLevels?: ('bachelor' | 'master' | 'phd')[];
  content?: string;
  semester?: string | null;
  rejectionReason?: string | null;
}


export interface RejectReviewDto {
  reason: string;
}
