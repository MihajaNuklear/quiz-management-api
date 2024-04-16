import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../core/base.repository";
import { CommentDocument, Commentary } from "./entities/comment.entity";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class CommentRepository extends BaseRepository<
  CommentDocument,
  Commentary
> {
  constructor(@InjectModel(Commentary.name) model) {
    super(model);
  }
}