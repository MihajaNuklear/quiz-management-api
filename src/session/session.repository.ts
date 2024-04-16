import { BaseRepository } from '../core/base.repository';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionDocument } from './entities/session.entity';

@Injectable()
export class SessionRepository extends BaseRepository<
  SessionDocument,
  Session
> {
  constructor(@InjectModel(Session.name) model) {
    super(model);
  }
}
