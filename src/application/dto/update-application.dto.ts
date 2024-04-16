import { PartialType } from '@nestjs/swagger';
import { CreateApplicationDto } from './create-application.dto';
import {
  ApplicationStatus,
  Certification,
  CompetitionResult,
  Diploma,
} from '../entities/application.entity';
import { User } from '../../user/entities/user.entity';

export class UpdateApplicationDto {
  _id: string;
  user: User;
  diploma: Diploma[];
  certification: Certification[];
  motivation: string;
  applicationStatus?: ApplicationStatus;
  competitionResult?: CompetitionResult;
}
