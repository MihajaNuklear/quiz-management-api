import { Paginated } from '../shared/types/page.interface';
import { Administration } from './entities/administration.entity';

export interface PaginatedAdministration extends Paginated<Administration> {
  applicationNames?: string[];
  pageNumber: number;
}
