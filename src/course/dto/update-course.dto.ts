import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto';

export class UpdateCourseDto extends PartialType(CreateCourseDto) {}

export class UpdateCourseWithHistoryDto extends UpdateCourseDto {
  history: History[];
}
