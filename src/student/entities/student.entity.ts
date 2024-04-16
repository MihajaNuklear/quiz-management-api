import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
/**
 * result
 */
@Schema()
export class Result {
  @Prop({ type: Number, required: true, default: 0 })
  note: number;

  @Prop({ type: Date })
  examDate: Date;
}
const resultSchema = SchemaFactory.createForClass(Result);

/**
 * Registrated course
 */
@Schema()
export class RegistratedCourse {
  _id?: string | Types.ObjectId;

  /**
   * courses
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Course' })
  course: string | Types.ObjectId;

  @Prop({ type: Number, required: true, default: 0 })
  average: number;

  /**
   * result
   */
  @Prop({ type: [resultSchema] })
  result: Result[];
}
const registratedCourseSchema = SchemaFactory.createForClass(RegistratedCourse);
/**
 * Represents a student
 */
@Schema()
export class Student {
  /**
   * Id  of student
   */
  _id?: string | Types.ObjectId;

  /**
   * registration Number to Student
   */
  @Prop({ type: String, required: true, unique: true })
  registrationNumber: string;

  /**
   * actual class to the Student
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'EducationalClasses' })
  educationalClasses?: Types.ObjectId | string;

  /**
   * User
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  /**
   * registrated course
   */
  @Prop({ type: [registratedCourseSchema] })
  registratedCourse?: RegistratedCourse[];
}

/**
 * Represents Student Mongoose Document
 */
export type StudentDocument = HydratedDocument<Student>;

/**
 * Instance of Student Mongoose Schema
 */
export const studentSchema = SchemaFactory.createForClass(Student);
