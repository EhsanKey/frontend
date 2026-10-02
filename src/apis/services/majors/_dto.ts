import type { DegreeLevel } from '@/models';

export interface MajorDto {
  id: string;
  name: string;
  code?: string;
  department?: string;
  degreeLevels?: DegreeLevel[];
  description?: string;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateMajorDto {
  name: string;
  code?: string;
  department?: string;
  degreeLevels?: DegreeLevel[];
  description?: string;
}

export interface UpdateMajorDto {
  name?: string;
  code?: string;
  department?: string;
  degreeLevels?: DegreeLevel[];
  description?: string;
}
