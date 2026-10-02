import type { IMajor } from '@/models';
import type { MajorDto } from './_dto';

export function toMajorModel(dto: MajorDto): IMajor {
  return {
    id: dto.id,
    name: dto.name,
    code: dto.code,
    department: dto.department,
    degreeLevels: dto.degreeLevels || [],
    description: dto.description,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
