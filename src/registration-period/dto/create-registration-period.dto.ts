import { OmitType } from '@nestjs/swagger';
import { RegistrationPeriod } from '../entities/registration-period.entity';

export class CreateRegistrationPeriodDto extends OmitType(RegistrationPeriod, ['_id']) {}
