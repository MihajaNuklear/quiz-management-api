import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Course } from './../../course/entities/course.entity';


/**
 * Represents course Selection
 */
@Schema()
export class courseSelection {
  _id?: string | Types.ObjectId;

  @Prop({ type: String })
  label: string;

  @Prop({ type: Number })
  credit: Number;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course' })
  courses: [Course];
}

const courseSelectionSchema = SchemaFactory.createForClass(courseSelection);
/**
 * Represents a educationalclasses
 */
@Schema({ timestamps: true })
export class EducationalClasses {
  /**
   * Id  of educationalclasses
   */
  _id: string | Types.ObjectId;

  /**
   * EducationalClasses name
   */
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /**
   * cursus affected to the class
   */
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cursus' })
  cursus: string;

  /**
   * EducationalClasses name
   */
  @Prop({ type: String, required: true, trim: true })
  schoolYear: string;

  /**
   * Flatted CourseID
   */
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Course' })
  flattedCourseSelection: string[];

  /**
   * Course selection
   */
  @Prop({
    type: [courseSelectionSchema],
    required: true,
  })
  courseSelection: courseSelection[];
}

/**
 * Represents EducationalClasses Mongoose Document
 */
export type EducationalClassesDocument = HydratedDocument<EducationalClasses>;

/**
 * Instance of EducationalClasses Mongoose Schema
 */
export const educationalclassesSchema =
  SchemaFactory.createForClass(EducationalClasses);
