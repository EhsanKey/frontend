import type {
  CampusLookupItemDto,
  LookupItemDto,
  TeachingLookupItemDto,
} from './_dto';
import type {
  ICampusLookupItem,
  ILookupItem,
  ITeachingLookupItem,
} from '@/models';

export function toLookupModel(dto: LookupItemDto): ILookupItem {
  return {
    id: dto.id,
    name: dto.name,
  };
}

export function toCampusLookupModel(dto: CampusLookupItemDto): ICampusLookupItem {
  return {
    id: dto.id,
    name: dto.name,
    universityId: dto.universityId,
    universityName: dto.universityName,
  };
}

export function toTeachingLookupModel(dto: TeachingLookupItemDto): ITeachingLookupItem {
  return {
    id: dto.id,
    title: dto.title,
    professorId: dto.professorId,
    professorName: dto.professorName,
    courseId: dto.courseId,
    courseName: dto.courseName,
    campusId: dto.campusId,
    campusName: dto.campusName,
    universityId: dto.universityId,
    universityName: dto.universityName,
    majorId: dto.majorId,
    majorName: dto.majorName,
    degreeLevel: dto.degreeLevel,
  };
}
