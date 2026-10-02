export interface ICourseRelationCounts {
  teachings: number;
  reviews: number;
  resources: number;
}

export interface ICourse {
  id: string;
  name: string;
  code?: string;
  units?: number;
  department?: string;
  universityId?: string;
  universityName?: string;
  campusId?: string;
  campusName?: string;
  description?: string;
  relationCounts?: ICourseRelationCounts;
  createdAt: string;
  updatedAt?: string | null;
}
