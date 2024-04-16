import { BaseRepository } from '../core/base.repository';
import { InjectModel } from '@nestjs/mongoose';
import { MailQueue, MailQueueDocument } from './entities/mail-queue.entity';

export class MailQueueRepository extends BaseRepository<
  MailQueueDocument,
  MailQueue
> {
  /**
   * Constructor for MailRepository
   * @param model Injected Model
   */
  constructor(@InjectModel(MailQueue.name) model) {
    super(model);
  }
}
