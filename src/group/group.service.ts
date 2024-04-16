import { Injectable } from '@nestjs/common';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group, GroupType } from './entities/group.entity';
import { PaginatedGroup } from './paginated-group.interface';
import {
  GROUPS_SEARCH_FIELDS_WITH_MONGO_SEARCH,
  GROUPS_SEARCH_INDEX,
} from './group.constants';
import { GroupRepository } from './group.repository';

/**
 * Service for Group layer
 */
@Injectable()
export class GroupService {
  /**
   * Constructor of groupService
   * @param groupRepository Injected Group Repository
   * @param userService Injected User Service
   */
  constructor(private readonly groupRepository: GroupRepository) {}

  /**
   * Get paginated Groups based on list criteria
   * @param criteria Criteria used to filter Groups
   * @returns Paginated Groups, groupNames and groupDescriptions for filter
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedGroup> {
    const paginatedGroups = await this.groupRepository.getList(
      GROUPS_SEARCH_INDEX,
      criteria,
      GROUPS_SEARCH_FIELDS_WITH_MONGO_SEARCH,
      {
        type: { $ne: GroupType.SUPER_ADMIN },
      },
    );

    return {
      ...paginatedGroups,
      groupNames: await this.groupRepository
        .find({ type: { $ne: GroupType.SUPER_ADMIN } })
        .sort({ name: 1 })
        .distinct('name')
        .exec(),
    };
  }

  /**
   * Get list of all Groups
   * @returns List of all Groups
   */
  findAll(): Promise<any[]> {
    const response = this.groupRepository.find({
      type: { $ne: GroupType.SUPER_ADMIN },
    });

    return response;
  }

  /**
   * Find Group with specific id
   * @param id _id of Group
   * @returns Group corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Group | undefined> {
    return this.groupRepository.findById(id);
  }

  async findOneGroup(name: string): Promise<Group | undefined> {
    return this.groupRepository.findOne({ name: name });
  }
  /**
   * Create a Group
   * @param createGroupDto Group to be created
   * @returns Created Group
   */
  async create(createGroupDto): Promise<Group | any> {
    return this.groupRepository.create(createGroupDto);
  }

  /**
   * Update Group with specific Id
   * @param id Id of Group
   * @param updateGroupDto Partial of Group containing the update
   * @returns Updated Group
   */
  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<Group> {
    const updatedGroup = await this.groupRepository.update(id, updateGroupDto);
    return updatedGroup;
  }


  /**
   * Remove Group with specific id
   * @param id Id of Group
   * @returns true if deletion is successful
   */
  async remove(id: string): Promise<boolean> {
    return this.groupRepository.delete(id);
  }

  /**
   * Get a list of suggestions for autocomplete
   * @param query query string
   * @returns list of suggestions
   */
  getRequestSuggestions(query: string): Promise<string[]> {
    return this.groupRepository.getAutocompleteSuggestions(
      GROUPS_SEARCH_INDEX,
      query,
      GROUPS_SEARCH_FIELDS_WITH_MONGO_SEARCH,
    );
  }
}
