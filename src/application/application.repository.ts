import { BaseRepository } from '../core/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import {
  Application,
  ApplicationDocument,
} from './entities/application.entity';

export class ApplicationRepository extends BaseRepository<
  ApplicationDocument,
  Application
> {
  /**
   * Constructor for ApplicationRepository
   * @param model Injected Model
   */
  constructor(@InjectModel(Application.name) model) {
    super(model);
  }
}
