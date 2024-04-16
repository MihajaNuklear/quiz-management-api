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
  Query,
} from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { Course } from './entities/course.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { Paginated } from '../shared/types/page.interface';
/**
 * Controller for Course layer
 */
@Controller('course')
export class CourseController {
  /**
   * Constructor for CourseController
   * @param courseService Injected CourseService
   */
  constructor(private readonly courseService: CourseService) {}

  /**
   * Create Course
   * @param createCourseDto Course that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created Course record',
    type: Course,
  })
  @RequirePrivilege(PrivilegeName.CREATE_COURSE)
  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.courseService.create(createCourseDto);
    HttpResponseService.sendSuccess<Course>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Courses inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All Course records found',
    type: Course,
    isArray: true,
  })
  @Get('/all')
  @RequirePrivilege(PrivilegeName.VIEW_COURSE)
  async findAll(@Res() res: FastifyReply) {
    const results: Course[] = await this.courseService.findAll();
    HttpResponseService.sendSuccess<Course[]>(res, HttpStatus.OK, results);
  }

    /**
   * Get Courses by findByTeacherId
   * @param res Fastify response
   */
    @GenericApiOkResponse({
      description: 'All Course records found',
      type: Course,
      isArray: true,
    })
    @Get('/user/:id')
    @RequirePrivilege(PrivilegeName.VIEW_COURSE)
    async findTeacherCourseByUserId(@Param('id') id: string,@Res() res: FastifyReply) {
      const results: Course[] = await this.courseService.findTeacherCourseByUserId(id);
      HttpResponseService.sendSuccess<Course[]>(res, HttpStatus.OK, results);
    }

  /**
   * Get paginated list of Course based on list criteria
   * @param queryParams List criteria to find Courses
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'Paginated Courses',
    type: Course,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COURSE)
  @Get()
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: Paginated<Course> = await this.courseService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<Paginated<Course>>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find a Course by its _id
   * @param id _id of the Course
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Course,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COURSE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.courseService.findOne(id);
    HttpResponseService.sendSuccess<Course>(res, HttpStatus.OK, result);
  }

  /**
     * Find a Course by its _id
     * @param id _id of the Course
     * @param res Fastify response
     */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Course,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COURSE,PrivilegeName.VIEW_PROFILE)
  @Get('sessionId/:id')
  async findCourseBySessionId(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.courseService.findCourseBySessionId(id);
    HttpResponseService.sendSuccess<Course>(res, HttpStatus.OK, result);
  }

  /**
   * Update Course
   * @param id _id of Course
   * @param updateCourseDto update of Course
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated Course record',
    type: Course,
  })
  @RequirePrivilege(PrivilegeName.EDIT_COURSE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.courseService.update(id, updateCourseDto);
    HttpResponseService.sendSuccess<Course>(res, HttpStatus.OK, result);
  }
  
  /**
   * Add session
   * @param id _id of Course
   * @param updateCourseDto update of Course session
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated Course record',
    type: Course,
  })
  @RequirePrivilege(PrivilegeName.EDIT_COURSE)
  @Patch('session/:id')
  async addSession(
    @Param('id') id: string,
    @Body() updateCourseDto: any,
    @Res() res: FastifyReply,
  ) {
    const result = await this.courseService.addSession(id, updateCourseDto);
    HttpResponseService.sendSuccess<Course>(res, HttpStatus.OK, result);
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
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.courseService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
