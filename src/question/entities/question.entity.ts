import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * result
 */
@Schema()
export class Choice {
  @Prop({ type: String })
  _id ?: string;

  @Prop({ type: String })
  choiceValue: string;
}

const choiceSchema = SchemaFactory.createForClass(Choice);
/**
 * Represents a Question
 */
@Schema({ timestamps: true })
export class Question {
  /**
   * Id  of Question
   */
  _id: string | Types.ObjectId;

  /**
   * question question
   */
  @Prop({ type: String, default: 0 })
  questionNumber: string;

  /**
   * question question
   */
  @Prop({ type: String })
  questionAsked: string;

  /**
   * question choice
   */
  @Prop({ type: [choiceSchema] })
  choice: Choice[];

  /**
   * question trueAnswer
   */
  @Prop({ type: String })
  trueAnswer: string;

  /**
   * question was used date
   */
  @Prop({ type: Date })
  wasUsedDate?: Date;
}

/**
 * Represents Question Mongoose Document
 */
export type QuestionDocument = HydratedDocument<Question>;

/**
 * Instance of Question Mongoose Schema
 */
export const QuestionSchema = SchemaFactory.createForClass(Question);
