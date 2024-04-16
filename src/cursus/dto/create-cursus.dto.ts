import { OmitType } from '@nestjs/swagger';
import { Cursus } from '../entities/cursus.entity';

export class CreateCursusDto extends OmitType(Cursus, ['_id']) {}
