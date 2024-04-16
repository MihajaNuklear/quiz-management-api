import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Cursus, CursusSchema } from './entities/cursus.entity';
import { CursusController } from './cursus.controller';
import { CursusRepository } from './cursus.repository';
import { CursusService } from './cursus.service';
import { PrivilegeModule } from '../privilege/privilege.module';
import { HistoryModule } from '../history/history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Cursus.name, schema: CursusSchema }]),
    PrivilegeModule,
    HistoryModule,
  ],
  controllers: [CursusController],
  providers: [CursusService, CursusRepository],
  exports: [CursusRepository, CursusService],
})
export class CursusModule {}
