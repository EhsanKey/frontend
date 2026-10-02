import type { ProfessorDto, ProfessorRelationCountsDto } from './_dto';
import type { IProfessor, IProfessorRelationCounts } from '@/models';

export const toProfessorRelationCountsModel = (
  dto?: ProfessorRelationCountsDto,
): IProfessorRelationCounts => ({
  teachings: dto?.teachings ?? 0,
  reviews: dto?.reviews ?? 0,
  resources: dto?.resources ?? 0,
  inquiries: dto?.inquiries ?? 0,
});

export const toProfessorModel = (dto: ProfessorDto): IProfessor => ({
  id: dto.id,
  name: dto.name,
  title: dto.title,
  universityId: dto.universityId,
  universityName: dto.universityName,
  campusId: dto.campusId,
  campusName: dto.campusName,
  department: dto.department,
  email: dto.email,
  bio: dto.bio,
  avatarUrl: dto.avatarUrl ?? null,
  relationCounts: toProfessorRelationCountsModel(dto.relationCounts),
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
});
