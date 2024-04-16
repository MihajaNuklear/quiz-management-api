import { Paginated } from '../shared/types/page.interface';
import { Course } from './entities/course.entity';

export interface PaginatedCourse extends Paginated<Course> {
  courseNames?: string[];
  pageNumber: number;

}
