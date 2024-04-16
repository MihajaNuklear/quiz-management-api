import { EducationalClasses } from '../educational-classes/entities/educational-classes.entity';
import { Paginated } from '../shared/types/page.interface';
import { Session } from './entities/session.entity';

export interface PaginatedSession extends Paginated<Session> {
  sessionNames?: string[];
  pageNumber: number;
}

export interface OccuppedClasses {
  classes: EducationalClasses[];
  sessions: Session[]
}