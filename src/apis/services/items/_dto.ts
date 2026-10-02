import type { ItemCategory, ItemStatus } from '@/models';

export interface ItemDto {
  id: number;
  title: string;
  category: ItemCategory;
  status: ItemStatus;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  authorName?: string;
}

export interface CreateItemDto {
  title: string;
  category: ItemCategory;
  status: ItemStatus;
  description?: string;
}

export type UpdateItemDto = Partial<CreateItemDto>;
