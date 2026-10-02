import type { ICampus } from '@/models';
import type { CampusDto } from './_dto';

export function toCampusModel(dto: CampusDto): ICampus {
  return {
    id: dto.id,
    name: dto.name,
    universityId: dto.universityId,
    universityName: dto.universityName || dto.university?.name,
    university: dto.university || (dto.universityName ? { id: dto.universityId, name: dto.universityName } : undefined),
    description: dto.description,
    majorCount: dto.majorCount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
