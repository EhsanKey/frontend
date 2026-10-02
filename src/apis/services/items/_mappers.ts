import type { ItemDto } from './_dto';
import type { IItem } from '@/models';

export const toItemModel = (dto: ItemDto): IItem => ({
  id: dto.id,
  title: dto.title,
  category: dto.category,
  status: dto.status,
  description: dto.description,
  createdAt: dto.createdAt,
  updatedAt: dto.updatedAt,
  authorName: dto.authorName,
});
