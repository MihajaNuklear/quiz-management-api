import { OmitType } from '@nestjs/swagger';
import { MailQueue, MailQueueStatus } from '../entities/mail-queue.entity';

export class CreateMailDto extends OmitType(MailQueue, ['_id']) {}
