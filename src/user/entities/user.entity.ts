import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { HydratedDocument, Types } from 'mongoose';

/**
 * Enumeration of Tables
 */
export enum Table {
  USERS = 'USERS',
  ROLES = 'ROLES',
}
export enum GENDER {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

/**
 * Represents a filter
 */
export interface Filter {
  // Represents variable fields that can be string / number / Date / string [] / boolean
  [key: string]: string | number | Date | Array<string | boolean>;
}

/**
 * Represents an user filter
 */
@Schema()
export class UserFilter {
  /**
   * Id  of user filter
   */
  _id?: string;

  /**
   * Name  of user filter
   */
  @Prop({ type: String, required: true })
  name: string;

  /**
   * Table name
   */
  @Prop({ type: String, enum: Object.values(Table), required: true })
  table: Table;

  /**
   * Stored filter
   */
  @Prop({ type: mongoose.Schema.Types.Mixed, required: true })
  filter: Filter;
}

/**
 * Instance of user filter schema
 */
const userFilterSchema = SchemaFactory.createForClass(UserFilter);

/**
 * Represents a User
 */
@Schema({ timestamps: true })
export class User {
  /**
   * Id  of user
   */
  _id?: string | Types.ObjectId;

  /**
   * User first name
   */
  @Prop({ type: String, trim: true, required: true })
  firstname: string;

  /**
   * Username used for login
   */
  @Prop({ type: String, trim: true })
  username: string; // ça peut être le matricule

  /**
   * User last name
   */
  @Prop({ type: String, trim: true, required: true })
  lastname: string;

  /**
   * User last name
   */
  @Prop({ type: String, trim: true, required: true })
  address: string;

  /**
   * User email
   */
  @Prop({ type: String, trim: true, required: true, unique: true })
  email: string;

  /**
   * User phone number
   */
  @Prop({ type: [String], required: true })
  phone: string[];

  /**
   * Encrypted password
   */
  @Prop({ type: String, trim: true })
  password?: string;

  /**
   * Gender name
   */
  @Prop({ type: String, enum: Object.values(GENDER), required: true })
  gender: GENDER;

  /**
   * BirthPlace
   */
  @Prop({ type: String, trim: true, required: true })
  birthPlace: string; // birthplace

  /**
   * BirthDate
   */
  @Prop({ type: Date, trim: true, required: true })
  birthDate: Date; // birthdate

  /**
   * User phone number
   */
  @Prop({ type: String, required: false })
  photo: string;

  /**
   * User role
   */
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Group' })
  groups: string[];

  /**
   * User role
   */
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Role' })
  roles: string[];

  /**
   * User creation Date
   */

  @Prop({ type: Date, required: true })
  creationDate: Date;
  /**
   * User filters
   */
  @Prop({ type: [userFilterSchema] })
  filters: UserFilter[];

  /**
   * Failed connection count
   */
  @Prop({ type: Number, required: false })
  failedConnectionCount?: number;

  /**
   * Determine if account is active
   */
  @Prop({ type: Boolean, default: true, required: true })
  isActive: boolean;

  /**
   * Determine if account is delete
   */
  @Prop({ type: Boolean, default: false, required: true })
  isDelete: boolean;

  /**
   * Determine if coun Usage Equestion
   */
  @Prop({ type: Number })
  countUsageEquestion?: number;
  /**
   * Determine if date Usage Equestion
   */
  @Prop({ type: Date })
  dateUsageEquestion?: Date;
}

/**
 * Represents User Mongoose Document
 */
export type UserDocument = HydratedDocument<User>;

/**
 * Instance of User Mongoose Schema
 */
export const userSchema = SchemaFactory.createForClass(User);

/**
 * Encrypt password on user creation
 */
userSchema.pre<UserDocument>('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});
