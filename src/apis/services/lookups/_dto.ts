export interface LookupItemDto {
  id: string;
  name: string;
}

export interface CampusLookupItemDto {
  id: string;
  name: string;
  universityId: string;
  universityName?: string;
}

export interface TeachingLookupItemDto {
  id: string;
  title: string;
  professorId?: string;
  professorName?: string;
  courseId?: string;
  courseName?: string;
  campusId?: string;
  campusName?: string;
  universityId?: string;
  universityName?: string;
  majorId?: string;
  majorName?: string;
  degreeLevel?: string;
}
