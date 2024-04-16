import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../core/base.repository';
import { Teacher, TeacherDocument } from './entities/teacher.entity';

/**
 * Repository for Teacher layer
 * Extends BaseRepository
 */
@Injectable()
export class TeacherRepository extends BaseRepository<
  TeacherDocument,
  Teacher
> {
  /**
   * Constructor for TeacherRepository
   * @param model Injected Model
   */
  constructor(@InjectModel(Teacher.name) model) {
    super(model);
  }
}
