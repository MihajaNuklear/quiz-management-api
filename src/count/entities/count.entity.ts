import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * Represents a Count
 */
@Schema()
export class Count {
  /**
   * Id  of Count
   */
  _id: string | Types.ObjectId;

  /**
   * count Candidate Value
   */
  @Prop({ type: Number, default: 0 })
  countCandidateValue: number;

  /**
   * count Student Value
   */
  @Prop({ type: Number, default: 0 })
  countStudentValue: number;

  /**
   * count Teacher Value
   */
  @Prop({ type: Number, default: 0 })
  countTeachertValue: number;

  /**
   * count Administration Value
   */
  @Prop({ type: Number, default: 0 })
  countAdministrationValue: number;
}

/**
 * Represents Count Mongoose Document
 */
export type CountDocument = HydratedDocument<Count>;

/**
 * Instance of Count Mongoose Schema
 */
export const countSchema = SchemaFactory.createForClass(Count);
