import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * Represents a teacher
 */
@Schema({ timestamps: true })
export class Teacher {
  /**
   * Id  of teacher
   */
  _id: string | Types.ObjectId;

  /**
   * user of the Teacher
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;
  /**
   * Time work done default 0
   */
  @Prop({ type: Number, required: true, default: 0 })
  timeWork: number;
}

/**
 * Represents Teacher Mongoose Document
 */
export type TeacherDocument = HydratedDocument<Teacher>;

/**
 * Instance of Teacher Mongoose Schema
 */
export const teacherSchema = SchemaFactory.createForClass(Teacher);
