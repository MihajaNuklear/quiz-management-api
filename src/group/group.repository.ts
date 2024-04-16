import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../core/base.repository';
import { Group, GroupDocument } from './entities/group.entity';

/**
 * Repository for Group layer
 * Extends BaseRepository
 */
@Injectable()
export class GroupRepository extends BaseRepository<GroupDocument, Group> {
    /**
     * Constructor for GroupRepository
     * @param model Injected Model
     */
    constructor(@InjectModel(Group.name) model) {
        super(model);
    }
}
