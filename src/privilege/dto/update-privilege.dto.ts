import { PartialType } from '@nestjs/swagger';
import { CreatePrivilegeDto } from './create-privilege.dto';
/**
 * Dto used for Privilege update
 * UpdatePrivilegeDto is a partial of Privilege
 */
export class UpdatePrivilegeDto extends PartialType(CreatePrivilegeDto) {}
