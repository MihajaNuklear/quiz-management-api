import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export enum SemesterType {
  SEMESTER_1 = 'SEMESTER_1',
  SEMESTER_2 = 'SEMESTER_2',
  SEMESTER_3 = 'SEMESTER_3',
  SEMESTER_4 = 'SEMESTER_4',
  SEMESTER_5 = 'SEMESTER_5',
  SEMESTER_6 = 'SEMESTER_6',
  SEMESTER_7 = 'SEMESTER_7',
  SEMESTER_8 = 'SEMESTER_8',
  SEMSETER_9 = 'SEMESTER_9',
  SEMESTER_10 = 'SEMESTER_10',
}
@Schema({ timestamps: true })
export class Course {
  _id: string | Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' })
  teacher: string;

  @Prop({ type: String, enum: Object.values(SemesterType) })
  semester?: SemesterType;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Session' })
  session?: string[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);

export type CourseDocument = HydratedDocument<Course>;
