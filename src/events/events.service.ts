import { Injectable } from '@nestjs/common';
import { CreateSchoolEventDto } from './dto/create-event.dto';
import { SchoolEvent } from './entities/event.entity';
import { EventRepository } from './events.repository';
import { UpdateSchoolEventDto } from './dto/update-event.dto';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedEvent } from './paginated-event.interface';
import { EVENT_SEARCH_FIELDS } from './events.constants';

@Injectable()
export class EventsService {
  /**
   * Constructor of groupService
   * @param eventsRepository Injected Group Repository
   * @param userService Injected User Service
   */
  constructor(private readonly eventRepository: EventRepository) {}

  /**
   * Get list of all educationalClasses
   * @returns List of all educationalClasses
   */
  findAll(): Promise<SchoolEvent[]> {
    const dateNow = new Date();
    return this.eventRepository
      .find({ endDate: { $gte: dateNow } })
      .sort({ startDate: -1 });
  }

  /**
   * Create a Group
   * @param createSchoolEventDto Group to be created
   * @returns Created Group
   */
  async create(createSchoolEventDto): Promise<SchoolEvent | any> {
    return this.eventRepository.create(createSchoolEventDto);
  }

  /**
   * Get paginated Event and list , based on list criteria
   * @param criteria criteria used to find Event
   * @returns Paginated Event
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedEvent> {
    const paginatedEvents = await this.eventRepository.getByListCriteria(
      criteria as ListCriteria,
      EVENT_SEARCH_FIELDS,
      [],
      { isDeleted: false },
    );

    return {
      ...paginatedEvents,
      pageNumber: Math.ceil(paginatedEvents.totalItems / criteria.pageSize),
    };
  }

  /**
   * Find Group with specific id
   * @param id _id of Group
   * @returns Group corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<SchoolEvent | undefined> {
    return this.eventRepository.findById(id);
  }

  /**
   * Update Event with specific Id
   * @param id Id of Event
   * @param updateGroupDto Partial of event containing the update
   * @returns Updated event
   */
  async update(
    id: string,
    updateGroupDto: UpdateSchoolEventDto,
  ): Promise<SchoolEvent> {
    const updatedGroup = await this.eventRepository.update(id, updateGroupDto);
    return updatedGroup;
  }
}
