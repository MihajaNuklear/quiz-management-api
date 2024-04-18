import { OmitType } from '@nestjs/swagger';
import { QuizSession } from '../entities/quiz-session.entity';

export class CreateQuizSessionDto extends OmitType(QuizSession, ['_id']) {}
