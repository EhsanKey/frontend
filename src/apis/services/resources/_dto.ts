import type { ResourceKind, ResourceStatus } from '@/models';

export interface ResourceFileDto {
  id?: string;
  fileId?: string;
  fileName?: string;
  originalName?: string;
  mimeType?: string;
  fileType?: string;
  fileSize?: number;
  fileUrl?: string;
  telegramFileId?: string;
}

export interface ResourceSubmissionDto {
  id: string;
  title?: string;
  resourceKind: ResourceKind;
  status: ResourceStatus;
  rejectionReason?: string | null;
  files?: ResourceFileDto[];
  fileCount?: number;
  createdAt: string;
  publishedAt?: string | null;
  updatedAt?: string | null;

  // Nested domain objects (v1.1.0 standard)
  professor?: { id: string; name: string; isNew?: boolean };
  course?: { id: string; name: string; isNew?: boolean };
  user?: { id?: string; displayName?: string; username?: string };
  university?: { id?: string; name?: string };
  campus?: { id?: string; name?: string };
  major?: { id?: string; name?: string };

  // Flat fields (legacy fallback)
  professorId?: string;
  professorName?: string;
  courseId?: string;
  courseName?: string;
}

export interface UpdateResourceDto {
  universityId?: string;
  campusId?: string;
  majorId?: string | null;
  courseCategory?: 'general' | 'specialized';
  professorId?: string | null;
  professorName?: string;
  professorIsNew?: boolean;
  courseId?: string | null;
  courseName?: string;
  courseIsNew?: boolean;
  degreeLevel?: 'bachelor' | 'master' | 'phd';
  title?: string;
  resourceKind?: ResourceKind;
  rejectionReason?: string | null;
}


export interface RejectResourceDto {
  reason: string;
}
