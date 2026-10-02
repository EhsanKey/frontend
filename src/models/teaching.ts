import type { DegreeLevel } from './major';

export interface ITeaching {
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
