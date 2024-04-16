import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';
import { SessionRepository } from './session.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Session, SessionSchema } from './entities/session.entity';
import { EducationalClassesModule } from '../educational-classes/educational-classes.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Session.name, schema: SessionSchema }]),
    EducationalClassesModule,
    HistoryModule
  ],

  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionRepository, SessionService],
})
export class SessionModule {}
