import type { DegreeLevel } from '@/models';

export interface TeachingDto {
  id: string;
  degreeLevel: DegreeLevel;
  professorId?: string;
  professor: {
    id: string;
    name: string;
  };
  courseId?: string;
  course: {
    id: string;
    name: string;
  };
  campusId?: string;
  campus: {
    id: string;
    name: string;
    university?: {
      id: string;
      name: string;
    };
  };
  majorId?: string;
  major: {
    id: string;
    name: string;
  };
  semester?: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateTeachingDto {
  degreeLevel: DegreeLevel;
  professorId: string;
  courseId: string;
  campusId: string;
  majorId: string;
  semester?: string;
}

export interface UpdateTeachingDto {
  degreeLevel?: DegreeLevel;
  professorId?: string;
  courseId?: string;
  campusId?: string;
  majorId?: string;
  semester?: string;
}
