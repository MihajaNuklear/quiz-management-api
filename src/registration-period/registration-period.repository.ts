import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegistrationPeriod, RegistrationPeriodDocument } from './entities/registration-period.entity';

@Injectable()
export class RegistrationPeriodRepository extends BaseRepository<
    RegistrationPeriodDocument,
    RegistrationPeriod
  > {
  constructor(@InjectModel(RegistrationPeriod.name) model) {
    super(model);
  }
}
