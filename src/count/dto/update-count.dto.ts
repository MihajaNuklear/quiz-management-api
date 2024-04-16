import { PartialType } from '@nestjs/swagger';
import { CreateCountDto } from './create-count.dto';

/**
 * Dto used for Count update
 * UpdateCountDto is partial of Count
 */
export class UpdateCountDto extends PartialType(CreateCountDto) {}
