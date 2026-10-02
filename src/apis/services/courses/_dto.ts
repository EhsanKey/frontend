export interface CourseDto {
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
  relationCounts?: {
    teachings: number;
    reviews: number;
    resources: number;
  };
  createdAt: string;
  updatedAt?: string | null;
}

export interface CreateCourseDto {
  name: string;
  code?: string;
  units?: number;
  department?: string;
  universityName?: string;
  description?: string;
}

export interface UpdateCourseDto {
  name?: string;
  code?: string;
  units?: number;
  department?: string;
  universityName?: string;
  description?: string;
}

export interface MergeCourseDto {
  targetId: string;
}

export interface CourseRelationCountsDto {
  teachings: number;
  reviews: number;
  resources: number;
}
