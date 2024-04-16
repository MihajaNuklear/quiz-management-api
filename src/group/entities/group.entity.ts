import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * Enumeration of Group type
 */
export enum GroupType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  NEW_USER_DEFAULT_GROUP = 'NEW_USER_DEFAULT_GROUP',
  CREATED_GROUP = 'CREATED_GROUP',
}

/**
 * Represents a group
 */
@Schema({ timestamps: true })
export class Group {
  /**
   * Id  of group
   */
  _id: string | Types.ObjectId;

  /**
   * Group name
   */
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /**
  * Group alias
  */
  @Prop({ type: String, required: true, trim: true })
  alias: string;

  /**
   * Group description
   */
  @Prop({ type: String, required: true, trim: true })
  description: string;
}

/**
 * Represents Group Mongoose Document
 */
export type GroupDocument = HydratedDocument<Group>;

/**
 * Instance of Group Mongoose Schema
 */
export const groupSchema = SchemaFactory.createForClass(Group);
