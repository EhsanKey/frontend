import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { IMajor } from '@/models';

export interface MajorsClientProps {
  initialData?: PaginatedResult<IMajor>;
}
