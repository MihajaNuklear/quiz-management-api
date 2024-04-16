import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export enum ActionName {
  CREATE_COMMENT = 'CREATE_COMMENT',
  UPDATE_COMMENT = 'UPDATE_COMMENT',
  DELETE_COMMENT = 'DELETE_COMMENT',

  UPDATE_APPLICATION_STATUS = 'UPDATE_APPLICATION_STATUS',

  CREATE_ROLE = 'CREATE_ROLE',
  UPDATE_ROLE = 'UPDATE_ROLE',
  DELETE_ROLE = 'DELETE_ROLE',

  CREATE_USER = 'CREATE_USER',
  UPDATE_USER = 'UPDATE_USER',
  DELETE_USER = 'DELETE_USER',

  ENABLE_USER = 'ENABLE_USER',
  DISABLE_USER = 'DISABLE_USER',

  CREATE_STUDENT = 'CREATE_STUDENT',
  UPDATE_STUDENT = 'UPDATE_STUDENT',
  DELETE_STUDENT = 'DELETE_STUDENT',

  CREATE_TEACHER = 'CREATE_TEACHER',
  UPDATE_TEACHER = 'UPDATE_TEACHER',
  DELETE_TEACHER = 'DELETE_TEACHER',

  CREATE_CURSUS = 'CREATE_CURSUS',
  UPDATE_CURSUS = 'UPDATE_CURSUS',
  DELETE_CURSUS = 'DELETE_CURSUS',
}

/**
 * Represent Type of Action
 */
@Schema()
export class Action {
  _id?: string | Types.ObjectId;

  @Prop({ type: String, required: true })
  name: ActionName;

  @Prop({ type: String, required: false })
  proof?: string;
}
const ActionSchema = SchemaFactory.createForClass(Action);

/**
 * Represents a history
 */
@Schema({ timestamps: true })
export class History {
  /**
   * Id  of history
   */
  _id: string | Types.ObjectId;

  /**
   * detail  of action
   */
  @Prop({ type: ActionSchema, required: true })
  action: Action;

  /**
   * user of the comment
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  /**
   * Id of the commented document
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, required: true })
  targetId: string;

  /**
   * Target entity name
   */
  @Prop({ type: String, required: true })
  entity: string;
}
/**
 * Represents History Mongoose Document
 */
export type HistoryDocument = HydratedDocument<History>;

/**
 * Instance of History Mongoose Schema
 */
export const historySchema = SchemaFactory.createForClass(History);
