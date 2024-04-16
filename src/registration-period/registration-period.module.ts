import { Module } from '@nestjs/common';
import { RegistrationPeriodService } from './registration-period.service';
import { RegistrationPeriodController } from './registration-period.controller';
import { RegistrationPeriodRepository } from './registration-period.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { PrivilegeModule } from '../privilege/privilege.module';
import {
  RegistrationPeriod,
  RegistrationPeriodSchema,
} from './entities/registration-period.entity';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: RegistrationPeriod.name,
        schema: RegistrationPeriodSchema,
      },
    ]),
    PrivilegeModule,
    HistoryModule,
  ],
  controllers: [RegistrationPeriodController],
  providers: [RegistrationPeriodService, RegistrationPeriodRepository],
  exports: [RegistrationPeriodRepository, RegistrationPeriodService],
})
export class RegistrationPeriodModule {}
