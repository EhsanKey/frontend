import type { ResourceSubmissionDto } from './_dto';
import type { IResourceSubmission } from '@/models';

export const toResourceSubmissionModel = (
  dto: ResourceSubmissionDto,
): IResourceSubmission => {
  const profName = dto.professor?.name || dto.professorName || '';
  const crsName = dto.course?.name || dto.courseName || '';
  const defaultTitle =
    [crsName, profName].filter(Boolean).join(' - ') || '';

  return {
    id: dto.id,
    professorId: dto.professor?.id || dto.professorId || null,
    professorName: profName || undefined,
    professorIsNew: dto.professor?.isNew ?? (dto as unknown as Record<string, unknown>).professorIsNew as boolean ?? false,
    courseId: dto.course?.id || dto.courseId || null,
    courseName: crsName || undefined,
    courseIsNew: dto.course?.isNew ?? (dto as unknown as Record<string, unknown>).courseIsNew as boolean ?? false,
    universityId: dto.university?.id || (dto as unknown as Record<string, unknown>).universityId as string | undefined,
    universityName: dto.university?.name || (dto as unknown as Record<string, unknown>).universityName as string | undefined,
    campusId: dto.campus?.id || (dto as unknown as Record<string, unknown>).campusId as string | undefined,
    campusName: dto.campus?.name || (dto as unknown as Record<string, unknown>).campusName as string | undefined,
    majorId: dto.major?.id || (dto as unknown as Record<string, unknown>).majorId as string | null | undefined,
    majorName: dto.major?.name || (dto as unknown as Record<string, unknown>).majorName as string | undefined,
    courseCategory: (dto as unknown as Record<string, unknown>).courseCategory as 'general' | 'specialized' | undefined,
    degreeLevel: (dto as unknown as Record<string, unknown>).degreeLevel as string | undefined,
    title: dto.title || defaultTitle,
    resourceKind: dto.resourceKind,
    status: dto.status,
    rejectionReason: dto.rejectionReason,
    files: (dto.files ?? []).map((f) => ({
      fileId: f.fileId || f.id || f.telegramFileId || '',
      fileName: f.fileName || f.originalName || 'file',
      mimeType: f.mimeType || f.fileType || 'application/octet-stream',
      fileSize: f.fileSize ?? 0,
      fileUrl: f.fileUrl,
    })),
    studentName:
      dto.user?.displayName ||
      dto.user?.username ||
      (dto as unknown as Record<string, unknown>).studentName as string | undefined,
    createdAt: dto.createdAt,
    publishedAt: dto.publishedAt,
  };
};
