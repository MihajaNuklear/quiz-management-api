import { Module } from '@nestjs/common';
import { AdministrationService } from './administration.service';
import { AdministrationController } from './administration.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Administration,
  AdministrationSchema,
} from './entities/administration.entity';
import { AdministrationRepository } from './administration.repository';
import { UserModule } from '../user/user.module';
import { CountModule } from '../count/count.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Administration.name, schema: AdministrationSchema },
    ]),
    UserModule,
    CountModule,
    HistoryModule
  ],
  controllers: [AdministrationController],
  providers: [AdministrationService, AdministrationRepository],
})
export class AdministrationModule {}
