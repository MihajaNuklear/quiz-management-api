import { BaseRepository } from '../core/base.repository';
import { Course, CourseDocument } from './entities/course.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CourseRepository extends BaseRepository<CourseDocument, Course> {
  constructor(@InjectModel(Course.name) model) {
    super(model);
  }
}
