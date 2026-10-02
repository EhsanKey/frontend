export interface ProfessorDto {
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
  relationCounts?: {
    teachings: number;
    reviews: number;
    resources: number;
    inquiries: number;
  };
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateProfessorDto {
  name: string;
  title?: string;
  department?: string;
  universityName?: string;
  email?: string;
  bio?: string;
}

export interface UpdateProfessorDto {
  name?: string;
  title?: string;
  department?: string;
  universityName?: string;
  email?: string;
  bio?: string;
}

export interface MergeProfessorDto {
  targetId: string;
}

export interface ProfessorRelationCountsDto {
  teachings: number;
  reviews: number;
  resources: number;
  inquiries: number;
}
