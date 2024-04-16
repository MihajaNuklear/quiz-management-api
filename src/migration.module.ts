import { Module } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { CONFIGURATION_TOKEN_DI } from './config/configuration-di.constant';
import configuration from './config/configuration.constant';
import { AuthModule } from './auth/auth.module';
import { DbScriptModule } from './db-script/db-script.module';
import { PrivilegeModule } from './privilege/privilege.module';
import { RoleModule } from './role/role.module';
import { TokenRequestModule } from './token-request/token-request.module';
import { UserModule } from './user/user.module';
import { CursusModule } from './cursus/cursus.module';
import { StudentModule } from './student/student.module';
import { CourseModule } from './course/course.module';
import { TeacherModule } from './teacher/teacher.module';
import { EducationalClassesModule } from './educational-classes/educational-classes.module';
import { CountModule } from './count/count.module';
import { CommentModule } from './comment/comment.module';
import { ApplicationModule } from './application/application.module';
import { EventsModule } from './events/events.module';
import { RegistrationPeriodModule } from './registration-period/registration-period.module';



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
    TokenRequestModule,
    CursusModule,
    StudentModule,
    CourseModule,
    TeacherModule,
    EducationalClassesModule,
    CountModule,
    CommentModule,
    ApplicationModule,
    EventsModule,
    RegistrationPeriodModule,
  ],
  controllers: [],
  providers: [
    {
      provide: CONFIGURATION_TOKEN_DI,
      useValue: configuration(),
    },
    Reflector,
    JwtService,
  ],
})
export class MigrationModule {}
