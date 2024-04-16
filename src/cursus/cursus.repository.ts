import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cursus, CursusDocument } from './entities/cursus.entity';

@Injectable()
export class CursusRepository extends BaseRepository<CursusDocument, Cursus> {
  constructor(@InjectModel(Cursus.name) model) {
    super(model);
  }
}
