import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { QuizSession, QuizSessionDocument } from './entities/quiz-session.entity';

@Injectable()
export class QuizSessionRepository extends BaseRepository<QuizSessionDocument, QuizSession> {
  constructor(@InjectModel(QuizSession.name) model) {
    super(model);
  }
}
