import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IUniversity } from '@/models';

export interface UniversitiesClientProps {
  initialData?: PaginatedResult<IUniversity>;
}
