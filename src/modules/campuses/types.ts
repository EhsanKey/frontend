import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ICampus, IUniversity } from '@/models';

export interface CampusesClientProps {
  initialData?: PaginatedResult<ICampus>;
  initialUniversities?: IUniversity[];
}
