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
import { TeacherService } from './teacher.service';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { Teacher } from './entities/teacher.entity';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { Paginated } from '../shared/types/page.interface';
import { UpdateTeacherDto } from './dto/update-teacher.dto';

@Controller('teacher')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  /**
   * Create teacher
   * @param createTeacherDto Teacher that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created teacher record',
    type: Teacher,
  })
  @RequirePrivilege(PrivilegeName.CREATE_TEACHER)
  @Post()
  async create(
    @Body() createTeacherDto: CreateTeacherDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.teacherService.create(createTeacherDto);
    HttpResponseService.sendSuccess<Teacher>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Teachers inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All teacher records found',
    type: Teacher,
    isArray: true,
  })
  @RequirePrivilege(PrivilegeName.VIEW_TEACHER)
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: Teacher[] = await this.teacherService.findAll();
    HttpResponseService.sendSuccess<Teacher[]>(res, HttpStatus.OK, results);
  }

  /**
   * Get paginated list of Teacher based on list criteria
   * @param queryParams List criteria to find Teachers
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'Paginated teachers',
    type: Teacher,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_TEACHER)
  @Get()
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: Paginated<Teacher> = await this.teacherService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<Paginated<Teacher>>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find a Teacher by its _id
   * @param id _id of the Teacher
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Teacher,
  })
  @RequirePrivilege(PrivilegeName.VIEW_TEACHER)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.teacherService.findOne(id);
    HttpResponseService.sendSuccess<Teacher>(res, HttpStatus.OK, result);
  }

  /**
   * Update Teacher
   * @param id _id of Teacher
   * @param updateTeacherDto update of Teacher
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated teacher record',
    type: Teacher,
  })
  @RequirePrivilege(PrivilegeName.EDIT_TEACHER)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTeacherDto: UpdateTeacherDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.teacherService.update(id, updateTeacherDto);
    HttpResponseService.sendSuccess<Teacher>(res, HttpStatus.OK, result);
  }

    /**
   * Find a Teacher by user_id+9-
   * @param id _id of the Teacher
   * @param res Fastify response
   */
    @GenericApiOkResponse({
      description: 'The corresponding record to the id',
      type: Teacher,
    })
    @RequirePrivilege(PrivilegeName.VIEW_PROFILE)
    @Get('user/:id')
    async findOneByUser(@Param('id') userId: string, @Res() res: FastifyReply) {
      const result = await this.teacherService.findOneByUser(userId);
      HttpResponseService.sendSuccess<Teacher>(res, HttpStatus.OK, result);
    }

  /**
   * Remove Teacher with specific _id
   * @param id _id of Teacher to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_TEACHER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.teacherService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
