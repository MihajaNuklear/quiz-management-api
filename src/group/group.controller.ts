import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { Paginated } from '../shared/types/page.interface';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { Group } from './entities/group.entity';
import { GroupService } from './group.service';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';

/**
 * Controller for Group layer
 */
@Controller('group')
export class GroupController {
  /**
   * Constructor for GroupController
   * @param groupService Injected GroupService
   */
  constructor(private readonly groupService: GroupService) { }

  /**
   * Create group
   * @param createGroupDto Group that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created group record',
    type: Group,
  })
  @RequirePrivilege(PrivilegeName.CREATE_GROUP)
  @Post()
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.groupService.create(createGroupDto);
    HttpResponseService.sendSuccess<Group>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Groups inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All group records found',
    type: Group,
    isArray: true,
  })
  @RequirePrivilege(PrivilegeName.VIEW_GROUP,PrivilegeName.VIEW_PROFILE)
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: Group[] = await this.groupService.findAll();
    HttpResponseService.sendSuccess<Group[]>(res, HttpStatus.OK, results);
  }

  /**
   * Get paginated list of Group based on list criteria
   * @param queryParams List criteria to find Groups
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'Paginated groups',
    type: Group,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_GROUP)
  @Get()
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: Paginated<Group> = await this.groupService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<Paginated<Group>>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find a Group by its _id
   * @param id _id of the Group
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Group,
  })
  @RequirePrivilege(PrivilegeName.VIEW_GROUP,PrivilegeName.VIEW_PROFILE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.groupService.findOne(id);
    HttpResponseService.sendSuccess<Group>(res, HttpStatus.OK, result);
  }

  /**
   * Update Group
   * @param id _id of Group
   * @param updateGroupDto update of Group
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated group record',
    type: Group,
  })
  @RequirePrivilege(PrivilegeName.EDIT_GROUP)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.groupService.update(id, updateGroupDto);
    HttpResponseService.sendSuccess<Group>(res, HttpStatus.OK, result);
  }

  /**
   * Remove Group with specific _id
   * @param id _id of Group to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_GROUP)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.groupService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }

  /**
   * Get list of suggestions for search ba
   * @param search search query
   * @param req Fastify Request
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'Get list of suggestions for search bar',
    type: String,
    isArray: true,
  })
  @RequirePrivilege(PrivilegeName.CREATE_GROUP)
  @Post('suggestions')
  async requestSuggestions(
    @Body() search: string,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const result = await this.groupService.getRequestSuggestions(search);
    HttpResponseService.sendSuccess<string[]>(res, HttpStatus.OK, result);
  }
}
