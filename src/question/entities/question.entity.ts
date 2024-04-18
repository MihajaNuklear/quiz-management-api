import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * Represents a Question
 */
@Schema()
export class Question {
  /**
   * Id  of Question
   */
  _id: string | Types.ObjectId;

  /**
   * question question
   */
  @Prop({ type: Number, default: 0 })
  questionNumber: number;

  /**
   * question question
   */
  @Prop({ type: String })
  questionAsked: string;

  /**
   * question choice
   */
  @Prop({ type: [String] })
  choice: string[];

  /**
   * question trueAnswer
   */
  @Prop({ type: Number })
  trueAnswer: number;

  /**
   * question was used date
   */
  @Prop({ type: Date })
  wasUsedDate?: Date;

  /**
   * question was used time
   */
  @Prop({ type: String })
  wasUsedTime?: string;
}

/**
 * Represents Question Mongoose Document
 */
export type QuestionDocument = HydratedDocument<Question>;

/**
 * Instance of Question Mongoose Schema
 */
export const QuestionSchema = SchemaFactory.createForClass(Question);
