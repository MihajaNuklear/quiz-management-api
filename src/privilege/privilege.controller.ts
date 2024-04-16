import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { Privilege, PrivilegeName } from './entities/privilege.entity';
import { PrivilegeService } from './privilege.service';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
/**
 * Controller for Privilege layer
 */
@Controller('privilege')
export class PrivilegeController {
  /**
   * Constructor for PrivilegeController
   * @param privilegeService Injected Privilege Service
   */
  constructor(private readonly privilegeService: PrivilegeService) { }

  /**
   * Find all Privileges
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'All privilege records found',
    type: Privilege,
    isArray: true,
  })
  @RequirePrivilege(PrivilegeName.VIEW_PRIVILEGE)
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: Privilege[] = await this.privilegeService.findAll();
    HttpResponseService.sendSuccess<Privilege[]>(res, HttpStatus.OK, results);
  }

  /**
   * Create Privilege
   * @param createGroupDto Group that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created privilege record',
    type: Privilege,
  })
  @RequirePrivilege(PrivilegeName.CREATE_PRIVILEGE)
  @Post()
  async create(
    @Body() createPrivilegeDto: CreatePrivilegeDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.privilegeService.create(createPrivilegeDto);
    HttpResponseService.sendSuccess<Privilege>(res, HttpStatus.CREATED, result);
  }

  /**
   * Find a Group by its _id
   * @param id _id of the Group
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Privilege,
  })
  @RequirePrivilege(PrivilegeName.VIEW_PRIVILEGE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.privilegeService.findOne(id);
    HttpResponseService.sendSuccess<Privilege>(res, HttpStatus.OK, result);
  }

  /**
   * Update Group
   * @param id _id of Group
   * @param updateGroupDto update of Group
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated group record',
    type: Privilege,
  })
  @RequirePrivilege(PrivilegeName.EDIT_PRIVILEGE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdatePrivilegeDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.privilegeService.update(id, updateGroupDto);
    HttpResponseService.sendSuccess<Privilege>(res, HttpStatus.OK, result);
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
  @RequirePrivilege(PrivilegeName.DELETE_PRIVILEGE)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.privilegeService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
