import { OmitType } from '@nestjs/swagger';
import { Student } from '../entities/student.entity';

export class CreateStudentDto extends OmitType(Student, ['_id']) {}
