import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { EventsService } from './events.service';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { SchoolEvent } from './entities/event.entity';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { CreateSchoolEventDto } from './dto/create-event.dto';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedEvent } from './paginated-event.interface';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  /**
   * Create group
   * @param createSchoolEventDto Event that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created school event record.',
    type: SchoolEvent,
  })
  @RequirePrivilege(PrivilegeName.CREATE_EVENT)
  @Post()
  async create(
    @Body() createGroupDto: CreateSchoolEventDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.eventsService.create(createGroupDto);
    HttpResponseService.sendSuccess<SchoolEvent>(
      res,
      HttpStatus.CREATED,
      result,
    );
  }

  /**
   * Find all educational classes
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'The liste of school Event',
    type: SchoolEvent,
  })
  @RequirePrivilege(PrivilegeName.VIEW_EVENT)
  @Get()
  async findAll(@Res() res: FastifyReply) {
    const results: SchoolEvent[] = await this.eventsService.findAll();
    HttpResponseService.sendSuccess<SchoolEvent[]>(res, HttpStatus.OK, results);
  }

  /**
   * Get paginated list of User based on list criteria
   * @param queryParams List criteria to find Users
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Paginated users',
    type: SchoolEvent,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_EVENT, PrivilegeName.VIEW_PROFILE)
  @Get('list')
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: PaginatedEvent = await this.eventsService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<PaginatedEvent>(
      res,
      HttpStatus.OK,
      results,
    );
  }
  /**
   * Find Event by its _id
   * @param id _id of given Event
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: SchoolEvent,
  })
  @RequirePrivilege(PrivilegeName.VIEW_EVENT)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.eventsService.findOne(id);
    HttpResponseService.sendSuccess<SchoolEvent>(res, HttpStatus.OK, result);
  }

  /**
   * Update event
   * @param id _id of event
   * @param updateSchoolEventDto update of event
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'The updated event record',
    type: SchoolEvent,
  })
  @RequirePrivilege(PrivilegeName.EDIT_EVENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: any,
    @Res() res: FastifyReply,
  ) {
    const result = await this.eventsService.update(id, updateUserDto);
    HttpResponseService.sendSuccess<SchoolEvent>(res, HttpStatus.OK, result);
  }
}
