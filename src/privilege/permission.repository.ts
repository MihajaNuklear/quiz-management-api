import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from '../core/base.repository';
import { Privilege, PrivilegeDocument } from './entities/privilege.entity';

/**
 * Repository for Privilege layer
 * Extends BaseRepository
 */
@Injectable()
export class PrivilegeRepository extends BaseRepository<
  PrivilegeDocument,
  Privilege
> {
  /**
   * Constructor for PrivilegeRepository
   * @param model Injected Model
   */
  constructor(@InjectModel(Privilege.name) model) {
    super(model);
  }
}
