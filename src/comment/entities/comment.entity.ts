import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * Represents a comment
 */
@Schema({ timestamps: true })
export class Commentary {
  /**
   * Id  of comment
   */
  _id: string | Types.ObjectId;

  /**
   * user of the comment
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  /**
   * Id of the commented document
   */
  @Prop({ type: String, required: true })
  targetId: string;

  /**
   * Target entity name
   */
  @Prop({ type: String, required: true })
  entity: string;

  /**
   * Comment body
   */
  @Prop({ type: String, required: true })
  comment: string;
}

/**
 * Represents Comment Mongoose Document
 */
export type CommentDocument = HydratedDocument<Commentary>;

/**
 * Instance of Comment Mongoose Schema
 */
export const commentSchema = SchemaFactory.createForClass(Commentary);
