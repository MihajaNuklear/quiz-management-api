import { OmitType } from '@nestjs/swagger';
import { Administration } from '../entities/administration.entity';

export class CreateAdministrationDto extends OmitType(Administration, [
  '_id',
]) {}
