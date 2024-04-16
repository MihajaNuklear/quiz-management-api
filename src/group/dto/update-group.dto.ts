import { PartialType } from '@nestjs/swagger';
import { CreateGroupDto } from './create-group.dto';

/**
 * Dto used for Group update
 * UpdateGroupDto is partial of Group
 */
export class UpdateGroupDto extends PartialType(CreateGroupDto) {}
