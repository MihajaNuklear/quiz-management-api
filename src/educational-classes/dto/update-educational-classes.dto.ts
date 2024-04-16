import { PartialType } from '@nestjs/swagger';
import { CreateeducationalClassesDto } from './create-educational-classes.dto';

export class UpdateeducationalClassesDto extends PartialType(
  CreateeducationalClassesDto,
) {}
