import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryController } from './history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { History, historySchema } from './entity/history.entity';
import { HistoryRepository } from './history.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: History.name, schema: historySchema }]),
  ],
  controllers: [HistoryController],
  providers: [HistoryService,HistoryRepository],
  exports: [HistoryService,HistoryRepository]
})
export class HistoryModule {}
