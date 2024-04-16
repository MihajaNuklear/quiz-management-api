import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { HistoryService } from './history.service';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { History } from './entity/history.entity';
import { FastifyReply } from 'fastify';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { CreateHistoryDto } from './dto/create-history.dto';
import { UpdateHistoryDto } from './dto/update-history.dto';

@Controller('history')
export class HistoryController {
  constructor(private readonly historyService: HistoryService) {}
  /**
   * Create history
   * @param createHistoryDto history that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created history record',
    type: History,
  })
  @RequirePrivilege(PrivilegeName.CREATE_HISTORY)
  @Post()
  async create(
    @Body() createHistoryDto: CreateHistoryDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.historyService.create(createHistoryDto);
    HttpResponseService.sendSuccess<History>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all History inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All history records found',
    type: History,
    isArray: true,
  })
  @RequirePrivilege(PrivilegeName.VIEW_HISTORY, PrivilegeName.VIEW_PROFILE)
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: History[] = await this.historyService.findAll();
    HttpResponseService.sendSuccess<History[]>(res, HttpStatus.OK, results);
  }

  /**
   * Find a Student by its _id
   * @param id _id of the History
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: History,
  })
  @RequirePrivilege(PrivilegeName.VIEW_HISTORY)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.historyService.findOne(id);
    HttpResponseService.sendSuccess<History>(res, HttpStatus.OK, result);
  }

  /**
   * Find a Student by its _id
   * @param id _id of the History
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: History,
  })
  @RequirePrivilege(PrivilegeName.VIEW_HISTORY, PrivilegeName.VIEW_PROFILE)
  @Get('/all/:target')
  async findByTargetId(
    @Param('target') target: string,
    @Res() res: FastifyReply,
  ) {
    const result = await this.historyService.findOneByTargetId(target);
    HttpResponseService.sendSuccess<History>(res, HttpStatus.OK, result);
  }

  /**
   * Update history
   * @param id _id of History
   * @param updateHistoryDto update of History
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated student record',
    type: History,
  })
  @RequirePrivilege(PrivilegeName.EDIT_HISTORY)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHistoryDto: UpdateHistoryDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.historyService.update(id, updateHistoryDto);
    HttpResponseService.sendSuccess<History>(res, HttpStatus.OK, result);
  }

  /**
   * Remove History with specific _id
   * @param id _id of History to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_HISTORY)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.historyService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }

  @Get('fake-history')
  async createAFakeData(@Res() res: FastifyReply) {
    const result = await this.historyService.createFakeData();
    HttpResponseService.sendSuccess<History>(res, HttpStatus.CREATED, result);
  }

  @RequirePrivilege(PrivilegeName.VIEW_HISTORY)
  @Get('entity/:entityName')
  async getHistoryByEntity(
    @Param('entityName') entityName: string,
    @Res() res: FastifyReply,
  ) {
    const result = await this.historyService.findAllByEntity(entityName);
    HttpResponseService.sendSuccess<History>(res, HttpStatus.OK, result);
  }
}
