export type DegreeLevel = 'associate' | 'bachelor' | 'master' | 'doctorate' | 'unknown';

export interface IMajor {
  id: string;
  name: string;
  code?: string;
  department?: string;
  degreeLevels?: DegreeLevel[];
  description?: string;
  createdAt: string;
  updatedAt?: string | null;
}
