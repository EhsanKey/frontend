import type { RegisteredReviewDto } from './_dto';
import type { IRegisteredReview, ITeaching } from '@/models';

export function toRegisteredReviewModel(dto: RegisteredReviewDto): IRegisteredReview {
  let teaching: ITeaching | undefined = undefined;

  if (dto.teaching) {
    teaching = {
      id: dto.teaching.id,
      degreeLevel: dto.teaching.degreeLevel,
      professorId: dto.teaching.professor?.id,
      professor: dto.teaching.professor,
      courseId: dto.teaching.course?.id,
      course: dto.teaching.course,
      campusId: dto.teaching.campus?.id,
      campus: dto.teaching.campus,
      majorId: dto.teaching.major?.id,
      major: dto.teaching.major ?? { id: '', name: '-' },
      createdAt: '',
    };
  }

  return {
    id: dto.id,
    content: dto.content,
    teachingId: dto.teachingId,
    source: dto.source || 'system',
    submissionId: dto.submissionId ?? null,
    semester: dto.semester ?? null,
    student: dto.student ?? null,
    createdAt: dto.createdAt ?? null,
    updatedAt: dto.updatedAt ?? null,
    teaching,
  };
}
