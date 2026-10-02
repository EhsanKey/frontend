export type ResourceKind = 'lecture_note' | 'exam_sample';
export type ResourceStatus = 'pending' | 'approved' | 'rejected';

export interface IResourceFile {
  fileId: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  fileUrl?: string;
}

export interface IResourceSubmission {
  id: string;
  professorId?: string | null;
  professorName?: string;
  professorIsNew?: boolean;
  courseId?: string | null;
  courseName?: string;
  courseIsNew?: boolean;
  universityId?: string;
  universityName?: string;
  campusId?: string;
  campusName?: string;
  majorId?: string | null;
  majorName?: string;
  courseCategory?: 'general' | 'specialized';
  degreeLevel?: string;
  title: string;
  resourceKind: ResourceKind;
  status: ResourceStatus;
  rejectionReason?: string | null;
  files: IResourceFile[];
  studentName?: string;
  createdAt: string;
  publishedAt?: string | null;
}

