import type { DegreeLevel, ReviewSource } from '@/models';

export interface GetRegisteredReviewsFilterParams {
  page?: number;
  pageSize?: number;
  q?: string;
  search?: string;
  teachingId?: string;
  universityId?: string;
  campusId?: string;
  majorId?: string;
  professorId?: string;
  courseId?: string;
  degreeLevel?: DegreeLevel | '';
  source?: ReviewSource | 'all' | '';
  semester?: string;
}
