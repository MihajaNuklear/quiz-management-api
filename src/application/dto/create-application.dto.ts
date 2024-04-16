import { OmitType } from '@nestjs/swagger';
import { Application } from '../entities/application.entity';

/**
 * Dto used for Application Creation
 * Same as Application but omit _id
 */
export class CreateApplicationDto extends OmitType(Application, ['_id']) {}
