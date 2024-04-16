import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../core/base.repository';
import { Administration, AdministrationDocument } from './entities/administration.entity';


/**
 * Repository for Role layer
 * Extends BaseRepository
 */
@Injectable()
export class AdministrationRepository extends BaseRepository<AdministrationDocument, Administration> {

    constructor(@InjectModel(Administration.name) model) {
        super(model);
    }
}
