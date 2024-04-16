import { Injectable } from "@nestjs/common";
import { BaseRepository } from "../core/base.repository";
import { Role, roleDocument } from "./entities/role.entity";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class RoleRepository extends BaseRepository<roleDocument, Role> {
  /**
   * Constructor for RoleRepository
   * @param model Injected Model
   */
  constructor(@InjectModel(Role.name) model) {
    super(model);
  }
}