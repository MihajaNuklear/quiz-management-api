import { OmitType } from '@nestjs/swagger';
import { SchoolEvent } from '../entities/event.entity';

/**
 * Dto used for SchoolEvent Creation
 * Same as SchoolEvent but omit _id
 */
export class CreateSchoolEventDto extends OmitType(SchoolEvent, ['_id']) {}
