export interface CampusDto {
  id: string;
  name: string;
  universityId: string;
  universityName?: string;
  university?: {
    id: string;
    name: string;
  };
  description?: string;
  majorCount?: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCampusDto {
  name: string;
  universityId: string;
  description?: string;
}

export interface UpdateCampusDto {
  name?: string;
  universityId?: string;
  description?: string;
}
