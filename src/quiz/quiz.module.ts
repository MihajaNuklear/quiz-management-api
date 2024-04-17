import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Quiz, QuizSchema } from './entities/quiz.entity';
import { QuizController } from './quiz.controller';
import { QuizRepository } from './quiz.repository';
import { QuizService } from './quiz.service';
import { PrivilegeModule } from '../privilege/privilege.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Quiz.name, schema: QuizSchema }]),
    PrivilegeModule,
    HistoryModule,
  ],
  controllers: [QuizController],
  providers: [QuizService, QuizRepository],
  exports: [QuizRepository, QuizService],
})
export class QuizModule {}
