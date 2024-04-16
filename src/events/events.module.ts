import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SchoolEvent, schoolEventSchema } from './entities/event.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EventRepository } from './events.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: SchoolEvent.name, schema: schoolEventSchema }]),
  ],
  controllers: [EventsController],
  providers: [EventsService, EventRepository]
})
export class EventsModule {}