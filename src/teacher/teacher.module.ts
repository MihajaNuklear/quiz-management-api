import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Teacher, teacherSchema } from './entities/teacher.entity';
import { TeacherRepository } from './teacher.repository';
import { CountModule } from '../count/count.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Teacher.name, schema: teacherSchema }]),
    CountModule
  ],
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository],
  exports: [TeacherRepository, TeacherService],
})
export class TeacherModule {}
