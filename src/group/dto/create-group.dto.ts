import { OmitType } from '@nestjs/swagger';
import { Group } from '../entities/group.entity';

/**
 * Dto used for Group Creation
 * Same as Group but omit _id
 */
export class CreateGroupDto extends OmitType(Group, ['_id']) {}
