export interface IProfessorRelationCounts {
  teachings: number;
  reviews: number;
  resources: number;
  inquiries: number;
}

export interface IProfessor {
  id: string;
  name: string;
  title?: string;
  universityId?: string;
  universityName?: string;
  campusId?: string;
  campusName?: string;
  department?: string;
  email?: string;
  bio?: string;
  avatarUrl?: string | null;
  relationCounts?: IProfessorRelationCounts;
  createdAt: string;
  updatedAt?: string | null;
}
