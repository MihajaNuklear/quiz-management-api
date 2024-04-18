import { Module } from '@nestjs/common';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CONFIGURATION_TOKEN_DI } from './config/configuration-di.constant';
import configuration from './config/configuration.constant';
import { DbScriptModule } from './db-script/db-script.module';
import { RoleModule } from './role/role.module';
import { TokenRequestModule } from './token-request/token-request.module';
import { UserModule } from './user/user.module';
import { PrivilegeModule } from './privilege/privilege.module';
import { RequirePrivilegeGuard } from './core/guards/require-privilege.guard';
import { GroupModule } from './group/group.module';
import { CourseModule } from './course/course.module';
import { CursusModule } from './cursus/cursus.module';
import { ApplicationModule } from './application/application.module';
import { EducationalClassesModule } from './educational-classes/educational-classes.module';
import { AdministrationModule } from './administration/administration.module';
import { TeacherModule } from './teacher/teacher.module';
import { MailQueueModule } from './mail-queue/mail-queue.module';
import { StudentModule } from './student/student.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { FileUploadModule } from './file-upload/file-upload.module';
import { TokenService } from './token/token.service';
import { CountModule } from './count/count.module';
import { CommentModule } from './comment/comment.module';
import { HistoryModule } from './history/history.module';
import { EventsModule } from './events/events.module';
import { SessionModule } from './session/session.module';
import { RegistrationPeriodModule } from './registration-period/registration-period.module';
import { AppController } from './app.controller';
import { QuestionModule } from './question/question.module';
import { QuizSessionModule } from './quiz-session/quiz-session.module';

@Module({
  imports: [
    MongooseModule.forRoot(configuration().mongo.MAIN_DATABASE_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }),
    AuthModule,
    UserModule,
    DbScriptModule,
    PrivilegeModule,
    RoleModule,
    GroupModule,
    CourseModule,
    CursusModule,
    TokenRequestModule,
    ApplicationModule,
    AdministrationModule,
    TeacherModule,
    StudentModule,
    EducationalClassesModule,
    MailQueueModule,
    MailerModule,
    ScheduleModule.forRoot(),
    FileUploadModule,
    CountModule,
    CommentModule,
    HistoryModule,
    EventsModule,
    SessionModule,
    RegistrationPeriodModule,
    QuestionModule,
    QuizSessionModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: CONFIGURATION_TOKEN_DI,
      useValue: configuration(),
    },
    {
      provide: APP_GUARD,
      useClass: RequirePrivilegeGuard,
    },

    Reflector,
    JwtService,
    TokenService,
  ],
})
export class AppModule {}
