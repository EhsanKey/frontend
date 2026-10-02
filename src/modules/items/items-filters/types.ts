export interface ItemsFiltersProps {
  search: string;
  status: string;
  category: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
  onCategoryChange: (category: string) => void;
  onReset: () => void;
}
