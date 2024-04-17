import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Quiz, QuizDocument } from './entities/quiz.entity';

@Injectable()
export class QuizRepository extends BaseRepository<QuizDocument, Quiz> {
  constructor(@InjectModel(Quiz.name) model) {
    super(model);
  }
}
