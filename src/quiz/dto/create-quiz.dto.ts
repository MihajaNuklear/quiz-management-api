import { OmitType } from '@nestjs/swagger';
import { Quiz } from '../entities/quiz.entity';

export class CreateQuizDto extends OmitType(Quiz, ['_id']) {}
