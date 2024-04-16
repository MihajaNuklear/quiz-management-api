import { Paginated } from '../shared/types/page.interface';
import { Group } from './entities/group.entity';

export interface PaginatedGroup extends Paginated<Group> {
  groupNames: string[];
}
