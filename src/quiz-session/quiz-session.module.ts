import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QuizSession, QuizSessionSchema } from './entities/quiz-session.entity';
import { QuizSessionController } from './quiz-session.controller';
import { QuizSessionRepository } from './quiz-session.repository';
import { QuizSessionService } from './quiz-session.service';
import { PrivilegeModule } from '../privilege/privilege.module';
import { HistoryModule } from '../history/history.module';
import { QuestionModule } from '../question/question.module';
import { UserModule } from '../user/user.module';
import { CountModule } from '../count/count.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QuizSession.name, schema: QuizSessionSchema },
    ]),
    PrivilegeModule,
    HistoryModule,
    QuestionModule,
    UserModule,
    CountModule
  ],
  controllers: [QuizSessionController],
  providers: [QuizSessionService, QuizSessionRepository],
  exports: [QuizSessionRepository, QuizSessionService],
})
export class QuizSessionModule {}
