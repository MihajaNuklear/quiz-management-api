import { Paginated } from '../shared/types/page.interface';
import { Student } from './entities/student.entity';

export interface PaginatedStudents extends Paginated<Student> {
  teacherNames?: string[];
  pageNumber: number;
}
