import { OmitType } from '@nestjs/swagger';
import { Count } from '../entities/count.entity';

/**
 * Dto used for Count Creation
 * Same as Count but omit _id
 */
export class CreateCountDto extends OmitType(Count, ['_id']) {}
