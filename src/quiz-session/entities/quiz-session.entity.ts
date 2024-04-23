import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * result
 */
@Schema()
export class QuestionResult {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Question' })
  question: string | Types.ObjectId;

  @Prop({ type: Number })
  userAnswer: number;
}

const questionResultSchema = SchemaFactory.createForClass(QuestionResult);

@Schema({ timestamps: true })
export class QuizSession {
  _id: string | Types.ObjectId;


  @Prop({ type: [questionResultSchema], required: false })
  quiz: QuestionResult[];
}

export type QuizSessionDocument = HydratedDocument<QuizSession>;

export const QuizSessionSchema = SchemaFactory.createForClass(QuizSession);
