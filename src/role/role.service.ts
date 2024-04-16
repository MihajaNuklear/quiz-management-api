import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleRepository } from './role.repository';
import { Role } from './entities/role.entity';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedRole } from './paginated-role.interface';
import { ROLES_LOOKUP_STAGES, ROLE_SEARCH_FIELDS } from './role.constant';
import { Privilege } from '../privilege/entities/privilege.entity';
import { HistoryService } from '../history/history.service';
import { History } from '../history/entity/history.entity';
import { HistoryWithData } from 'src/history/dto/create-history-with-data';

@Injectable()
export class RoleService {
  constructor(
    private readonly historyService: HistoryService,
    private readonly roleRepository: RoleRepository,
  ) {}

  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    return this.roleRepository.create(createRoleDto);
  }

  /**
   * Get list of all Roles
   * @returns List of all Roles
   */
  findAll(): Promise<Role[]> {
    return this.roleRepository.find({}).populate(['privileges']);
  }

  /**
   * Get paginated Users and list of entity names and user fullNames, based on list criteria
   * @param criteria criteria used to find Users
   * @returns Paginated Users
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedRole> {
    const paginatedRole = await this.roleRepository.getByListCriteria(
      criteria,
      ROLE_SEARCH_FIELDS,
      ROLES_LOOKUP_STAGES,
    );

    return {
      ...paginatedRole,
      pageNumber: Math.ceil(paginatedRole.totalItems / criteria.pageSize),
    };
  }

  async findOneByName(name: string): Promise<Role | undefined> {
    return this.roleRepository.findOne({ name }).populate(['privileges']);
  }

  async findPrivilegeById(id: string): Promise<Privilege[]> {
    const role: Role = await this.roleRepository
      .findById(id)
      .populate('privileges')
      .lean()
      .exec();

    const privileges: unknown = role.privileges;

    if (
      Array.isArray(privileges) &&
      privileges.every((item) => typeof item === 'object' && '_id' in item)
    ) {
      return privileges as Privilege[];
    } else {
      throw new Error(
        'Les données de privilèges ne correspondent pas au modèle Privilege.',
      );
    }
  }

  /**
   * Find Role with specific id
   * @param id _id of Role
   * @returns Role corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Role | undefined> {
    return this.roleRepository.findById(id);
  }

  /**
   * Update Role with specific Id
   * @param id Id of Role
   * @param updateRoleDto Partial of Role containing the update
   * @returns Updated Role
   */
  async update(id: string, updateRoleDto: HistoryWithData): Promise<Role> {
    const { data, history } = updateRoleDto;

    const updatedRole = await this.roleRepository.update(id, data);

    if (updatedRole) {
      await this.historyService.create(history);
    }
    return updatedRole;
  }

  /**
   * Remove Role with specific id
   * @param id Id of Role
   * @returns true if deletion is successful
   */
  async remove(id: string, history: History): Promise<boolean> {
    const response = this.roleRepository.delete(id);
    if (response) {
      this.historyService.create(history);
    }
    return response;
  }
  // async remove(id: string): Promise<boolean> {
  //   return this.roleRepository.delete(id);
  // }
}
