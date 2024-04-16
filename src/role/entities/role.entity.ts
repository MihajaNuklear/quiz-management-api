import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

/**
 * Enumeration of Role type
 */
export enum RoleType {
  SUPER_ADMIN = 'SUPER_ADMIN',
  NEW_USER_DEFAULT_ROLE = 'NEW_USER_DEFAULT_ROLE',
  CREATED_ROLE = 'CREATED_ROLE',
}

@Schema({ timestamps: true })
export class Role {
  /**
   * Id  of role
   */
  _id: string | Types.ObjectId;

  /**
   * Role name
   */
  @Prop({ type: String, required: true, trim: true })
  name: string;

  /**
   * Group alias
   */
  @Prop({ type: String, required: true, trim: true })
  alias: string;

  /**
   * Role description
   */
  @Prop({ type: String, required: true, trim: true })
  description: string;

  /**
   * List of groups affected to Role
   */
  @Prop({ type: [mongoose.Schema.Types.ObjectId],required:true, ref: 'Group' })
  groups: string[];


  /**
   * List of privileges affected to Role
   */
  @Prop({ type: [mongoose.Schema.Types.ObjectId],required:true, ref: 'Privilege' })
  privileges: string[];

    /**
   * Role color
   */
    @Prop({ type: String, required: true, trim: true })
    color: string;
}
/**
 * Instance of Role Mongoose Schema
 */
export const roleSchema = SchemaFactory.createForClass(Role);

/**
 * Represents Role Mongoose Document
 */
export type roleDocument = HydratedDocument<Role>;