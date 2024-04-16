import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * Enumeration of event type
 */
export enum EventType {
  SCHOOL_EVENT = 'SCHOOL_EVENT',
  ADMIN_EVENT = 'ADMIN_EVENT',
  CAMPUS_EVENT = 'CAMPUS_EVENT',
}

/**
 * Represents a event
 */
@Schema({ timestamps: true })
export class SchoolEvent {
  /**
   * Id  of group
   */
  _id?: string | Types.ObjectId;

  /**
   * Event name
   */
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /**
   * Event description
   */
  @Prop({ type: String, required: true, trim: true })
  description: string;

  /**
   * Event type
   */
  @Prop({ type: String, enum: Object.values(EventType), required: true })
  type: EventType;
  /**
   *
   * Determine if event is passed
   */
  @Prop({ type: Boolean, default: true, required: true })
  isDeleted: boolean;

  /**
   * Start date
   */
  @Prop({ type: Date, trim: true, required: true })
  startDate: Date;

  /**
   * end date
   */
  @Prop({ type: Date, trim: true, required: true })
  endDate: Date;
}

/**
 * Represents Event Mongoose Document
 */
export type SchoolEventDocument = HydratedDocument<SchoolEvent>;

/**
 * Instance of Group Mongoose Schema
 */
export const schoolEventSchema = SchemaFactory.createForClass(SchoolEvent);
