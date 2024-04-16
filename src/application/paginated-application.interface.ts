import { Paginated } from '../shared/types/page.interface';
import { Application } from './entities/application.entity';

export interface PaginatedApplication extends Paginated<Application> {
  applicationNames?: string[];
  pageNumber: number;
}
