import type { ReviewSubmissionDto } from './_dto';
import type { IReviewSubmission } from '@/models';

const formatDegreeLevels = (degreeLevels?: string | string[]): string => {
  if (!degreeLevels) return '';
  if (Array.isArray(degreeLevels)) {
    return degreeLevels.join(', ');
  }
  return degreeLevels;
};

export const toReviewSubmissionModel = (
  dto: ReviewSubmissionDto,
): IReviewSubmission => ({
  id: dto.id,
  professorId: dto.professor?.id || dto.professorId || null,
  professorName:
    dto.professor?.name ||
    dto.professorName ||
    dto.existingProfessorName ||
    '-',
  professorIsNew: dto.professor?.isNew ?? (dto as unknown as Record<string, unknown>).professorIsNew as boolean ?? false,
  courseId: dto.course?.id || dto.courseId || null,
  courseName:
    dto.course?.name || dto.courseName || dto.existingCourseName || '-',
  courseIsNew: dto.course?.isNew ?? (dto as unknown as Record<string, unknown>).courseIsNew as boolean ?? false,
  universityId: dto.university?.id || (dto as unknown as Record<string, unknown>).universityId as string | undefined,
  universityName: dto.university?.name || (dto as unknown as Record<string, unknown>).universityName as string | undefined,
  campusId: dto.campus?.id || (dto as unknown as Record<string, unknown>).campusId as string | undefined,
  campusName: dto.campus?.name || (dto as unknown as Record<string, unknown>).campusName as string | undefined,
  majorId: dto.major?.id || (dto as unknown as Record<string, unknown>).majorId as string | null | undefined,
  majorName: dto.major?.name || (dto as unknown as Record<string, unknown>).majorName as string | undefined,
  courseCategory: (dto.courseCategory || (dto as unknown as Record<string, unknown>).courseCategory) as 'general' | 'specialized' | undefined,
  studentName:
    dto.user?.displayName ||
    dto.user?.username ||
    dto.studentName ||
    dto.userDisplayName ||
    '',
  degreeLevels: formatDegreeLevels(dto.degreeLevels),
  degreeLevelsRaw: Array.isArray(dto.degreeLevels)
    ? dto.degreeLevels
    : dto.degreeLevels
      ? [dto.degreeLevels]
      : [],
  content: dto.content,
  semester: dto.semester ?? null,
  status: dto.status,
  rejectionReason: dto.rejectionReason,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
