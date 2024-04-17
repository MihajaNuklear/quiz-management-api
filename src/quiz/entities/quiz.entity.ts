import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * Represents a Quiz
 */
@Schema()
export class Quiz {
  /**
   * Id  of Quiz
   */
  _id: string | Types.ObjectId;

  /**
   * quiz question
   */
  @Prop({ type: String })
  question: string;

  /**
   * quiz choice
   */
  @Prop({ type: [String] })
  choice: string[];

  /**
   * quiz trueAnswer
   */
  @Prop({ type: Number })
  trueAnswer: number;

  /**
   * quiz was used date
   */
  @Prop({ type: Date })
  wasUsedDate?: Date;

  /**
   * quiz was used time
   */
  @Prop({ type: String })
  wasUsedTime?: string;
}

/**
 * Represents Quiz Mongoose Document
 */
export type QuizDocument = HydratedDocument<Quiz>;

/**
 * Instance of Quiz Mongoose Schema
 */
export const QuizSchema = SchemaFactory.createForClass(Quiz);
