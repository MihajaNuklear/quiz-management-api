import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { Role } from './entities/role.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PaginatedRole } from './paginated-role.interface';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { HistoryWithData } from 'src/history/dto/create-history-with-data';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * Create role
   * @param createRoleDto Role that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created role record',
    type: Role,
  })
  @RequirePrivilege(PrivilegeName.CREATE_ROLE)
  @Post()
  async create(@Body() createRoleDto: CreateRoleDto, @Res() res: FastifyReply) {
    const result = await this.roleService.create(createRoleDto);
    HttpResponseService.sendSuccess<Role>(res, HttpStatus.CREATED, result);
  }

  @Get('all')
  findAll() {
    return this.roleService.findAll();
  }

  @GenericApiOkResponse({
    description: 'Paginated roles',
    type: Role,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_ROLE)
  @Get('list')
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: PaginatedRole = await this.roleService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<PaginatedRole>(res, HttpStatus.OK, results);
  }

  /**
   * Find a Role by its _id
   * @param id _id of the Role
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Role,
  })
  @RequirePrivilege(PrivilegeName.VIEW_ROLE, PrivilegeName.VIEW_PROFILE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.roleService.findOne(id);
    HttpResponseService.sendSuccess<Role>(res, HttpStatus.OK, result);
  }

  /**
   * Update Role
   * @param id _id of Role
   * @param updateRoleDto update of Role
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated role record',
    type: Role,
  })
  @RequirePrivilege(PrivilegeName.EDIT_ROLE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: HistoryWithData,
    @Res() res: FastifyReply,
  ) {
    const result = await this.roleService.update(id, updateRoleDto);
    HttpResponseService.sendSuccess<Role>(res, HttpStatus.OK, result);
  }

  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_ROLE)
  @Delete(':id')
  async remove(@Param('id') id: string, @Body() history, @Res() res) {
    const result = await this.roleService.remove(id, history);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
