import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';

export enum MailQueueStatus {
  SENT = 'SENT',
  NOT_SENT = 'NOT_SENT',
  ARCHIVED = 'ARCHIVED',
}

@Schema({ timestamps: true })
export class MailQueue extends Document {
  /**
   * Who sent a MailQueue
   */
  @Prop({ type: String, required: true })
  from: string;

  /**
   * receiving MailQueue
   */
  @Prop({ type: String, required: true })
  to: string;

  /**
   * subject of message
   */
  @Prop({ type: String, required: false })
  subject?: string;

  /**
   * Content of message
   */
  @Prop({ type: String, required: false })
  html?: string;

  /**
   * Message status
   */
  @Prop({
    type: String,
    required: true,
    enum: Object.values(MailQueueStatus),
    default: MailQueueStatus.NOT_SENT,
  })
  status: MailQueueStatus;

  /**
   * Number of sending attempt
   */
  @Prop({ type: Number, default: 0 })
  sendAttemptCount: number;
}

export type MailQueueDocument = HydratedDocument<MailQueue>;

export const mailQueueSchema = SchemaFactory.createForClass(MailQueue);
