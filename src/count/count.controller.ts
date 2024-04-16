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
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { Paginated } from '../shared/types/page.interface';
 
 
 
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { Count } from './entities/count.entity';
import { CountService } from './count.service';
import { CreateCountDto } from './dto/create-count.dto';
import { UpdateCountDto } from './dto/update-count.dto';


/**
 * Controller for count layer
 */
@Controller('count')
export class CountController {
  /**
   * Constructor for countController
   * @param countService Injected countService
   */
  constructor(private readonly countService: CountService) {}

  /**
   * Create count
   * @param createcountDto count that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created count record',
    type: Count,
  })
  @RequirePrivilege(PrivilegeName.CREATE_APPLICATION)
  @Post()
  async create(@Body() createcountDto: CreateCountDto, @Res() res: FastifyReply) {
    const result = await this.countService.create(createcountDto);
    HttpResponseService.sendSuccess<Count>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all counts inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All count records found',
    type: Count,
    isArray: true,
  })
  // @RequirePrivilege(PrivilegeName.VIEW_COUNT)
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: Count[] = await this.countService.findAll();
    HttpResponseService.sendSuccess<Count[]>(res, HttpStatus.OK, results);
  }

  @Get()
  async getCount(@Res() res: FastifyReply) {
    const result = await this.countService.getCount();
    HttpResponseService.sendSuccess<Count>(res, HttpStatus.OK, result);
  }

  /**
   * Find a count by its _id
   * @param id _id of the count
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Count,
  })
  // @RequirePrivilege(PrivilegeName.VIEW_COUNT)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.countService.findOne(id);
    HttpResponseService.sendSuccess<Count>(res, HttpStatus.OK, result);
  }

  /**
   * Update count
   * @param id _id of count
   * @param updatecountDto update of count
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated count record',
    type: Count,
  })
  // @RequirePrivilege(PrivilegeName.EDIT_COUNT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatecountDto: UpdateCountDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.countService.update(id, updatecountDto);
    HttpResponseService.sendSuccess<Count>(res, HttpStatus.OK, result);
  }

  /**
   * Remove count with specific _id
   * @param id _id of count to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  // @RequirePrivilege(PrivilegeName.DELETE_COUNT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.countService.remove(id);
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
  @Post('suggestions')
  async requestSuggestions(
    @Body() search: string,
    @Req() req: FastifyRequest,
    @Res() res: FastifyReply,
  ) {
    const result = await this.countService.getRequestSuggestions(search);
    HttpResponseService.sendSuccess<string[]>(res, HttpStatus.OK, result);
  }
}
