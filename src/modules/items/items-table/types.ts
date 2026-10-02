import type { IItem } from '@/models';
import type { PaginationMeta } from '@/apis/core/types/api-response';

export interface ItemsTableProps {
  items: IItem[];
  pagination?: PaginationMeta;
  isLoading?: boolean;
  onEdit: (item: IItem) => void;
  onDelete: (item: IItem) => void;
}
