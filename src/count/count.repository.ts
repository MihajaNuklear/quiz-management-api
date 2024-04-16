import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../core/base.repository';
import { Count, CountDocument } from './entities/count.entity';

/**
 * Repository for Count layer
 * Extends BaseRepository
 */
@Injectable()
export class CountRepository extends BaseRepository<CountDocument, Count> {
  /**
   * Constructor for CountRepository
   * @param model Injected Model
   */
  constructor(@InjectModel(Count.name) model) {
    super(model);
  }
}
