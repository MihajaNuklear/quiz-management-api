import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../core/base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { History, HistoryDocument } from "./entity/history.entity";
@Injectable()
export class HistoryRepository extends BaseRepository<
  HistoryDocument,
  History
> {
  constructor(@InjectModel(History.name) model) {
    super(model);
  }
}