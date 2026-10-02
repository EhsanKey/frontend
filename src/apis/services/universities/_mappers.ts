import type { IUniversity } from '@/models';
import type { UniversityDto } from './_dto';

export function toUniversityModel(dto: UniversityDto): IUniversity {
  return {
    id: dto.id,
    name: dto.name,
    slug: dto.slug,
    city: dto.city,
    description: dto.description,
    campusCount: dto.campusCount,
    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
  };
}
