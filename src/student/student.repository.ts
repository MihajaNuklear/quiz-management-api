import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Student, StudentDocument } from './entities/student.entity';

@Injectable()
export class StudentRepository extends BaseRepository<
  StudentDocument,
  Student
> {
  constructor(@InjectModel(Student.name) model) {
    super(model);
  }
}
