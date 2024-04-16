import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ timestamps: true })
export class RegistrationPeriod {
    _id: string | Types.ObjectId;

    @Prop({ type: Date, required: true, trim: true })
    startDate: Date;

    @Prop({ type: Date, required: true, trim: true })
    endDate: Date;

    @Prop({ type: Boolean, required: true, trim: true })
    isOpen: boolean;
}
export const RegistrationPeriodSchema = SchemaFactory.createForClass(RegistrationPeriod);

export type RegistrationPeriodDocument = HydratedDocument<RegistrationPeriod>;
