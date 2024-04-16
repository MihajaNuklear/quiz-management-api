import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './entities/course.entity';
import { CourseRepository } from './course.repository';
import { SessionModule } from '../session/session.module';
import { HistoryModule } from '../history/history.module';
import { TeacherModule } from '../teacher/teacher.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    SessionModule,
    HistoryModule,
    TeacherModule
  ],
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
  exports: [CourseRepository, CourseService],
})
export class CourseModule {}
