import type { DegreeLevel, ReviewSource } from '@/models';

export interface RegisteredReviewsFilterState {
  page: number;
  search: string;
  universityId?: string;
  campusId?: string;
  majorId?: string;
  professorId?: string;
  courseId?: string;
  degreeLevel?: DegreeLevel | '';
  source?: ReviewSource | 'all' | '';
}
