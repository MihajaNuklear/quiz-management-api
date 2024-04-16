import { Paginated } from '../shared/types/page.interface';
import { EducationalClasses } from './entities/educational-classes.entity';

export interface PaginatedEducationalClasses extends Paginated<EducationalClasses> {
  applicationNames?: string[];
  pageNumber: number;
}
