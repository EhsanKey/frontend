export type ItemStatus = 'ACTIVE' | 'PENDING' | 'INACTIVE';
export type ItemCategory = 'general' | 'technical' | 'financial' | 'administrative';

export interface IItem {
  id: number;
  title: string;
  category: ItemCategory;
  status: ItemStatus;
  description?: string;
  createdAt: string;
  updatedAt?: string;
  authorName?: string;
}

export interface IItemFilterParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
  category?: string;
}
