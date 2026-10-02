import type { DegreeLevel } from '@/models';

export interface GetTeachingsFilterParams {
  page?: number;
  pageSize?: number;
  limit?: number;
  offset?: number;
  search?: string;
  q?: string;
  universityId?: string;
  campusId?: string;
  majorId?: string;
  professorId?: string;
  courseId?: string;
  degreeLevel?: DegreeLevel;
}
