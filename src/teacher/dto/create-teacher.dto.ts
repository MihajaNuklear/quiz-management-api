import { OmitType } from '@nestjs/swagger';
import { Teacher } from '../entities/teacher.entity';

/**
 * Dto used for Teacher Creation
 * Same as Teacher but omit _id
 */
export class CreateTeacherDto extends OmitType(Teacher, ['_id']) {}
