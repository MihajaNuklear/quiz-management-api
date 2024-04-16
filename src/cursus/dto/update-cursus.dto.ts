import { PartialType } from '@nestjs/swagger';
import { CreateCursusDto } from './create-cursus.dto';

export class UpdateCursusDto extends PartialType(CreateCursusDto) {}
