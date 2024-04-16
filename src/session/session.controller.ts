import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Res,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SessionService } from './session.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { Session } from './entities/session.entity';
import { Paginated } from '../shared/types/page.interface';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { OccuppedClasses } from './paginated-session.interface';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  /**
   * Create Session
   * @param createSessionDto Session that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created Session record',
    type: Session,
  })
  @RequirePrivilege(PrivilegeName.CREATE_COURSE)
  @Post()
  async create(
    @Body() createSessionDto: CreateSessionDto,
    @Res() res: FastifyReply,
  ) {
    console.log(createSessionDto);

    const result = await this.sessionService.create(createSessionDto);
    HttpResponseService.sendSuccess<Session>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Sessions inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All Session records found',
    type: Session,
    isArray: true,
  })
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: Session[] = await this.sessionService.findAll();
    HttpResponseService.sendSuccess<Session[]>(res, HttpStatus.OK, results);
  }

  /**
   * Get paginated list of Session based on list criteria
   * @param queryParams List criteria to find Sessions
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'Paginated Sessions',
    type: Session,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COURSE)
  @Get()
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: Paginated<Session> = await this.sessionService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<Paginated<Session>>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find a Session by its _id
   * @param id _id of the Session
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Session,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COURSE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.sessionService.findOne(id);
    HttpResponseService.sendSuccess<Session>(res, HttpStatus.OK, result);
  }

    /**
   * Find Occuped class py courseId
   * @param id course id
   * @param res Fastify response
   */
    @GenericApiOkResponse({
      description: 'The corresponding record to the id',
      type: Object,
    })
    @RequirePrivilege(PrivilegeName.VIEW_COURSE)
    @Get('find-occuped/:courseId')
    async getOccupedClass(@Param('courseId') courseId: string, @Res() res: FastifyReply): Promise<void> {
      const result = await this.sessionService.getOccupedClass(courseId);
      HttpResponseService.sendSuccess<OccuppedClasses>(res, HttpStatus.OK, result);
    }
  

  /**
   * Find a Session by its _id
   * @param id _id of the Session
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Session,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COURSE,PrivilegeName.VIEW_PROFILE)
  @Get('classeId/:id')
  async findSessionByClassId(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.sessionService.findSessionByClassId(id);
    HttpResponseService.sendSuccess<Session[]>(res, HttpStatus.OK, result);
  }


  /**
   * Update Session
   * @param id _id of Session
   * @param updateSessionDto update of Session
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated Session record',
    type: Session,
  })
  @RequirePrivilege(PrivilegeName.EDIT_COURSE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSessionDto: UpdateSessionDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.sessionService.update(id, updateSessionDto);
    HttpResponseService.sendSuccess<Session>(res, HttpStatus.OK, result);
  }

  /**
   * Remove Course with specific _id
   * @param id _id of Course to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_COURSE)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Body() history: any,
    @Res() res,    
  ) {
    const result = await this.sessionService.remove(id,history);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
