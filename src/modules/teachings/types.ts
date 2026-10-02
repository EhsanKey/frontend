import type { PaginatedResult } from '@/apis/core/types/api-response';
import type { ICampus, ICourse, IMajor, IProfessor, ITeaching } from '@/models';

export interface TeachingsClientProps {
  initialData?: PaginatedResult<ITeaching>;
  initialProfessors?: IProfessor[];
  initialCourses?: ICourse[];
  initialCampuses?: ICampus[];
  initialMajors?: IMajor[];
}
