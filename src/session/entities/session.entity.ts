import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

@Schema()
export class Pointing {
  _id?: string | Types.ObjectId;

  @Prop({ type: Date })
  arrivalTime: Date;

  @Prop({ type: Date })
  departureTime: Date;

  @Prop({ type: String })
  user: string;
}

const pointingSchema = SchemaFactory.createForClass(Pointing);

@Schema({ timestamps: true })
export class Session {
  _id?: string | Types.ObjectId;

  @Prop({ type: Date })
  date: Date;

  @Prop({ type: String })
  start: string;

  @Prop({ type: String })
  end: string;

  @Prop({ type: Boolean })
  isExam: boolean;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'EducationalClasses' })
  occupiedClasses: string[];

  @Prop({ type: [pointingSchema] })
  pointing: Pointing[];
}

export type SessionDocument = HydratedDocument<Session>;

export const SessionSchema = SchemaFactory.createForClass(Session);
