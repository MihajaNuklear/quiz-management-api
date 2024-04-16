import { Paginated } from '../shared/types/page.interface';
import { Teacher } from './entities/teacher.entity';

export interface PaginatedTeachers extends Paginated<Teacher> {
  teacherName?: string[];
  pageNumber: number;
}
