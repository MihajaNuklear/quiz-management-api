import { Paginated } from '../shared/types/page.interface';
import { SchoolEvent } from './entities/event.entity';


export interface PaginatedEvent extends Paginated<SchoolEvent> {
  pageNumber: number,
}
