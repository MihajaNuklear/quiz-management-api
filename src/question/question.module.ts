import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Question, QuestionSchema } from './entities/question.entity';
import { QuestionController } from './question.controller';
 
import { PrivilegeModule } from '../privilege/privilege.module';
import { HistoryModule } from '../history/history.module';
import { QuestionRepository } from './question.repository';
import { QuestionService } from './question.service';
import { CountModule } from '../count/count.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Question.name, schema: QuestionSchema }]),
    PrivilegeModule,
    HistoryModule,
    CountModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService, QuestionRepository],
  exports: [QuestionRepository, QuestionService],
})
export class QuestionModule {}
