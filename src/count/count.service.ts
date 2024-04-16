import { Injectable } from '@nestjs/common';
import { ListCriteria } from '../shared/types/list-criteria.class';

import { Privilege } from '../privilege/entities/privilege.entity';
 
 
import { Count } from './entities/count.entity';
import { CountRepository } from './count.repository';
import { COUNTS_SEARCH_FIELDS_WITH_MONGO_SEARCH, COUNTS_SEARCH_INDEX } from './count.constant';
import { CreateCountDto } from './dto/create-count.dto';
import { UpdateCountDto } from './dto/update-count.dto';
import { PaginatedCount } from './paginated-count.interface';

interface PrivilegeType {
  _id: string;
  name: string;
  group: string;
  __v: number;
}

/**
 * Service for Count layer
 */
@Injectable()
export class CountService {
  /**
   * Constructor of CountService
   * @param countRepository Injected Count Repository
   * @param userService Injected User Service
   */
  constructor(private readonly countRepository: CountRepository) {}

  /**
   * Get paginated Counts based on list criteria
   * @param criteria Criteria used to filter Counts
   * @returns Paginated Counts, CountNames and CountDescriptions for filter
   */
  async getCount(): Promise<Count> {
    return this.countRepository.findOne({})
  }

  /**
   * Get list of all Counts
   * @returns List of all Counts
   */
  findAll(): Promise<Count[]> {
    return this.countRepository.find({}).populate(['group', 'privileges']);
  }

  async findAllPrivilege(): Promise<Count[]> {
    const Counts = await this.countRepository.find({}).populate('privileges');

    return Counts;
  }

 
  /**
   * Find Count with specific id
   * @param id _id of Count
   * @returns Count corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Count | undefined> {
    return this.countRepository.findById(id);
  }

  async findOneByName(name: string): Promise<Count | undefined> {
    return this.countRepository
      .findOne({ name })
      .populate(['group', 'privileges']);
  }

  /**
   * Create a Count
   * @param createCountDto Count to be created
   * @returns Created Count
   */
  async create(createCountDto: CreateCountDto): Promise<Count> {
    return this.countRepository.create(createCountDto);
  }

  /**
   * Update Count with specific Id
   * @param id Id of Count
   * @param updateCountDto Partial of Count containing the update
   * @returns Updated Count
   */
  async update(id: string, updateCountDto: UpdateCountDto): Promise<Count> {
    const updatedCount = await this.countRepository.update(id, updateCountDto);
    return updatedCount;
  }

  /**
   * Remove Count with specific id
   * @param id Id of Count
   * @returns true if deletion is successful
   */
  async remove(id: string): Promise<boolean> {
    return this.countRepository.delete(id);
  }

  /**
   * Get a list of suggestions for autocomplete
   * @param query query string
   * @returns list of suggestions
   */
  getRequestSuggestions(query: string): Promise<string[]> {
    return this.countRepository.getAutocompleteSuggestions(
      COUNTS_SEARCH_INDEX,
      query,
      COUNTS_SEARCH_FIELDS_WITH_MONGO_SEARCH,
    );
  }
}
