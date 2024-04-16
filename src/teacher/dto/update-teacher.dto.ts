import { PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from './create-teacher.dto';

/**
 * Dto used for Teacher update
 * UpdateTeacherDto is partial of Teacher
 */
export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}
