import { Module } from '@nestjs/common';
import { CountService } from './count.service';
import { CountController } from './count.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Count, countSchema } from './entities/count.entity';
import { CountRepository } from './count.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Count.name, schema: countSchema }]),
  ],
  controllers: [CountController],
  providers: [CountService, CountRepository],
  exports: [CountRepository, CountService],
})
export class CountModule {}
