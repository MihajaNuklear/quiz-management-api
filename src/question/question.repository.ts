import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question, QuestionDocument } from './entities/question.entity';

@Injectable()
export class QuestionRepository extends BaseRepository<QuestionDocument, Question> {
  [x: string]: any;
  constructor(@InjectModel(Question.name) model) {
    super(model);
  }
}
