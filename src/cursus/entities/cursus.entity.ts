import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { History } from './../../history/entity/history.entity';

@Schema({ timestamps: true })
export class Cursus {
  _id: string | Types.ObjectId;

  @Prop({ type: String, required: true, trim: true })
  name: string;

  @Prop({ type: String, required: false, trim: true })
  description?: string;
}

export interface CursusAndHistory {
  cursus: Cursus;
  history?: History;
}

export type CursusDocument = HydratedDocument<Cursus>;

export const CursusSchema = SchemaFactory.createForClass(Cursus);
