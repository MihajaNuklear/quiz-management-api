import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export enum ApplicationStatus {
  UNREAD = 'UNREAD',
  IN_PROCESSING = 'IN_PROCESSING',
  REGISTRATED_FOR_COMPETITION = 'REGISTRATED_FOR_COMPETITION',
  ACCEPTED_FOR_INTERVIEW = 'ACCEPTED_FOR_INTERVIEW',
  INTERVIEWED = 'INTERVIEWED',
  REQUEST_ACCEPTED = 'REQUEST_ACCEPTED',
  REQUEST_REFUSED = 'REQUEST_REFUSED',
}

export enum TaskStatus {
  FINISHED = 'FINISHED',
  IN_PROGRESS = 'IN_PROGRESS',
}

@Schema()
export class TaskDetails {
  _id?: string | Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Number, required: true })
  submissionNumber: number;

  @Prop({ type: String, required: true, enum: Object.values(TaskStatus) })
  status: TaskStatus;
}

const TaskDetailsSchema = SchemaFactory.createForClass(TaskDetails);

@Schema()
export class CompetitionResult {
  _id?: string | Types.ObjectId;

  @Prop({ type: Number, required: true })
  totalTasksNumber: number;

  @Prop({ type: Number, required: true })
  finishedTasksNumber: number;

  @Prop({ type: [TaskDetailsSchema], required: true })
  TaskDetails: TaskDetails[];
}

const CompetitionResultSchema = SchemaFactory.createForClass(CompetitionResult);
@Schema()
export class Diploma {
  _id?: string | Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  school: string;

  @Prop({ type: String, required: true })
  option: string;

  @Prop({ type: Number, required: true })
  obtentionYear: number;

  @Prop({ type: String, required: true })
  attachement: string;
}
const DiplomaSchema = SchemaFactory.createForClass(Diploma);

@Schema()
export class Certification {
  _id?: string | Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  institution: string;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: number;

  @Prop({ type: String, required: false })
  attachement: string;
}
const CertificationSchema = SchemaFactory.createForClass(Certification);

@Schema({ timestamps: true })
export class Application {
  _id: string | Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: string;

  @Prop({ type: [DiplomaSchema], required: true })
  diploma: Diploma[];

  @Prop({ type: [CertificationSchema], required: false })
  certification: Certification[];

  @Prop({ type: String, required: true })
  motivation: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ApplicationStatus),
  })
  applicationStatus?: ApplicationStatus;

  @Prop({ type: CompetitionResultSchema, required: false })
  competitionResult?: CompetitionResult;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);

export type ApplicationDocument = HydratedDocument<Application>;
