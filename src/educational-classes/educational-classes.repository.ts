import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  EducationalClasses,
  EducationalClassesDocument,
} from './entities/educational-classes.entity';

@Injectable()
export class EducationalClassesRepository extends BaseRepository<
  EducationalClassesDocument,
  EducationalClasses
> {
  constructor(@InjectModel(EducationalClasses.name) model) {
    super(model);
  }
}
