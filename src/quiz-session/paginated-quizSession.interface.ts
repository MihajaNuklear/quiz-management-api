import { Paginated } from '../shared/types/page.interface';
import { QuizSession } from './entities/quiz-session.entity';

export interface PaginatedQuizSession extends Paginated<QuizSession> {
  quizSessionNames?: string[];
  pageNumber: number;
}
