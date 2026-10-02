export interface UniversityDto {
  id: string;
  name: string;
  slug?: string;
  city?: string;
  description?: string;
  campusCount?: number;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateUniversityDto {
  name: string;
  slug?: string;
  city?: string;
  description?: string;
}

export interface UpdateUniversityDto {
  name?: string;
  slug?: string;
  city?: string;
  description?: string;
}
