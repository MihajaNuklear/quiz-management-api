import { OmitType } from '@nestjs/swagger';
import { Course } from '../entities/course.entity';

export class CreateCourseDto extends OmitType(Course, ['_id']) {}
