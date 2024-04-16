import { OmitType } from "@nestjs/swagger";
import { History } from "../entity/history.entity";



/**
 * Dto used for History Creation
 * Same as Teacher but omit _id
 */
export class CreateHistoryDto extends OmitType(History, ['_id']) {}