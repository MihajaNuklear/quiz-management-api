import { OmitType } from "@nestjs/swagger";
import { Commentary } from "../entities/comment.entity"


/**
 * Dto used for Comment Creation
 * Same as Teacher but omit _id
 */
export class CreateCommentDto extends OmitType(Commentary, ['_id']) {}