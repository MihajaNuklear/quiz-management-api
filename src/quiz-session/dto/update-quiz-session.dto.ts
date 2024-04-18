import { PartialType } from '@nestjs/swagger';
import { CreateQuizSessionDto } from './create-quiz-session.dto';

export class UpdateQuizSessionDto extends PartialType(CreateQuizSessionDto) {}
