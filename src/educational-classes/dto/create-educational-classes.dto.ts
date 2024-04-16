import { OmitType } from '@nestjs/swagger';
import { EducationalClasses } from '../entities/educational-classes.entity';

export class CreateeducationalClassesDto extends OmitType(EducationalClasses, [
  '_id',
]) {}
