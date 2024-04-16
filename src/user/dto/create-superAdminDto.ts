import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

/**
 * Dto used for User creation
 * Same as User but omit _id, password
 */
export class CreateSuperAdminDto extends OmitType(User, ['_id']) { }
