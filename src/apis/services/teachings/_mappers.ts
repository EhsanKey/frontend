import type { ITeaching } from '@/models';
import type { TeachingDto } from './_dto';

export function toTeachingModel(dto: TeachingDto): ITeaching {
  return {
    id: dto.id,
    degreeLevel: dto.degreeLevel,
    professorId: dto.professorId || dto.professor?.id,
    professor: dto.professor,
    courseId: dto.courseId || dto.course?.id,
    course: dto.course,
    campusId: dto.campusId || dto.campus?.id,
    campus: dto.campus,
    majorId: dto.majorId || dto.major?.id,
    major: dto.major,
    semester: dto.semester,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
