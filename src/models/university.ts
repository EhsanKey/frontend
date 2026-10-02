export interface IUniversity {
  id: string;
  name: string;
  slug?: string;
  city?: string;
  description?: string;
  campusCount?: number;
  createdAt: string;
  updatedAt?: string | null;
}
