import { OmitType } from '@nestjs/swagger';
import { Privilege } from '../entities/privilege.entity';

/**
 * Dto used for Privilege creation
 * Same as Privilege but omit _id
 */
export class CreatePrivilegeDto extends OmitType(Privilege, ['_id']) {}
