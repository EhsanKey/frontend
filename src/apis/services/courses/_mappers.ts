import type { CourseDto, CourseRelationCountsDto } from './_dto';
import type { ICourse, ICourseRelationCounts } from '@/models';

export const toCourseRelationCountsModel = (
  dto?: CourseRelationCountsDto,
): ICourseRelationCounts => ({
  teachings: dto?.teachings ?? 0,
  reviews: dto?.reviews ?? 0,
  resources: dto?.resources ?? 0,
});

export const toCourseModel = (dto: CourseDto): ICourse => ({
  id: dto.id,
  name: dto.name,
  code: dto.code,
  units: dto.units ?? 3,
  department: dto.department,
  universityId: dto.universityId,
  universityName: dto.universityName,
  campusId: dto.campusId,
  campusName: dto.campusName,
  description: dto.description,
  relationCounts: toCourseRelationCountsModel(dto.relationCounts),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
