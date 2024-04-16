import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../core/base.repository';
import { SchoolEvent, SchoolEventDocument } from './entities/event.entity';


/**
 * Repository for Event layer
 * Extends BaseRepository
 */
@Injectable()
export class EventRepository extends BaseRepository<SchoolEventDocument, SchoolEvent> {
    /**
     * Constructor for EventRepository
     * @param model Injected Model
     */
    constructor(@InjectModel(SchoolEvent.name) model) {
        super(model);
    }
}
