import type { DegreeLevel, ReviewSource } from '@/models';

export interface RegisteredReviewTeachingDto {
  id: string;
  degreeLevel: DegreeLevel;
  professor: {
    id: string;
    name: string;
  };
  course: {
    id: string;
    name: string;
  };
  campus: {
    id: string;
    name: string;
    university: {
      id: string;
      name: string;
    };
  };
  major: {
    id: string;
    name: string;
  } | null;
}

export interface RegisteredReviewStudentDto {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
}

export interface RegisteredReviewDto {
  id: string;
  content: string;
  teachingId: string;
  source: ReviewSource;
  submissionId?: string | null;
  semester?: string | null;
  student?: RegisteredReviewStudentDto | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  teaching?: RegisteredReviewTeachingDto | null;
}

export interface CreateRegisteredReviewDto {
  teachingId: string;
  content: string;
  semester?: string | null;
}

export interface UpdateRegisteredReviewDto {
  teachingId?: string;
  content?: string;
  semester?: string | null;
}
