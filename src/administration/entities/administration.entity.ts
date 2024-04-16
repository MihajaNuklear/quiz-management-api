import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document, HydratedDocument } from "mongoose";
import { User } from "../../user/entities/user.entity";

@Schema({ timestamps: true })
export class Administration extends Document {
    @Prop({ type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" })
    user: User

    @Prop({ type: String, required: true })
    position: string
}

export type AdministrationDocument = HydratedDocument<Administration>

export const AdministrationSchema = SchemaFactory.createForClass(Administration)
