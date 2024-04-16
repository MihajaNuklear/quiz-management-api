import { Paginated } from '../shared/types/page.interface';
import { Count } from './entities/count.entity';

export interface PaginatedCount extends Paginated<Count> {
  countNames: string[];
}
