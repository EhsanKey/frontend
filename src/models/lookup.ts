export interface ILookupItem {
  id: string;
  name: string;
}

export interface ICampusLookupItem {
  id: string;
  name: string;
  universityId: string;
  universityName?: string;
}

export interface ITeachingLookupItem {
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
