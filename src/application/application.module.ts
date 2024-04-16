import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { Application, ApplicationSchema } from './entities/application.entity';
import { ApplicationRepository } from './application.repository';
import { MailQueueModule } from '../mail-queue/mail-queue.module';
import { UserModule } from '../user/user.module';
import { GroupModule } from '../group/group.module';
import { RoleModule } from '../role/role.module';
import { CountModule } from '../count/count.module';
import { HistoryModule } from '../history/history.module';
import { StudentModule } from '../student/student.module';
import { EducationalClassesModule } from '../educational-classes/educational-classes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Application.name, schema: ApplicationSchema },
    ]),
    MailQueueModule,
    UserModule,
    GroupModule,
    RoleModule,
    CountModule,
    HistoryModule,
    StudentModule,
    EducationalClassesModule
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
