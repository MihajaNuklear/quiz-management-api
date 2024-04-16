import { PartialType } from '@nestjs/swagger';
import { CreateSchoolEventDto } from './create-event.dto';

/**
 * Dto used for schoolEvent update
 * UpdateSchoolEventDto is partial of SchoolEvent
 */
export class UpdateSchoolEventDto extends PartialType(CreateSchoolEventDto) {}
