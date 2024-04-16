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
  Res,
} from '@nestjs/common';
import { StudentService } from './student.service';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { Student } from './entities/student.entity';
import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateStudentDto } from './dto/create-student.dto';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { Paginated } from '../shared/types/page.interface';
import { UpdateStudentDto } from './dto/update-student.dto';
import { HistoryWithData } from '../history/dto/create-history-with-data';

@Controller('student')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  /**
   * Create student
   * @param createStudentDto Student that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created student record',
    type: Student,
  })
  @RequirePrivilege(PrivilegeName.CREATE_STUDENT)
  @Post()
  async create(
    @Body() createStudentDto: CreateStudentDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.studentService.create(createStudentDto);
    HttpResponseService.sendSuccess<Student>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Students inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All student records found',
    type: Student,
    isArray: true,
  })
  @RequirePrivilege(PrivilegeName.VIEW_STUDENT)
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: Student[] = await this.studentService.findAll();
    HttpResponseService.sendSuccess<Student[]>(res, HttpStatus.OK, results);
  }

  /**
   * Get paginated list of Student based on list criteria
   * @param queryParams List criteria to find Students
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'Paginated students',
    type: Student,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_STUDENT)
  @Get()
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: Paginated<Student> = await this.studentService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<Paginated<Student>>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find a Student by its _id
   * @param id _id of the Student
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Student,
  })
  @RequirePrivilege(PrivilegeName.VIEW_STUDENT, PrivilegeName.VIEW_PROFILE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.studentService.findOne(id);
    HttpResponseService.sendSuccess<Student>(res, HttpStatus.OK, result);
  }
  /**
   * Find a Student by user_id+9-
   * @param id _id of the Student
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Student,
  })
  @RequirePrivilege(PrivilegeName.VIEW_PROFILE)
  @Get('user/:id')
  async findOneByUser(@Param('id') userId: string, @Res() res: FastifyReply) {
    const result = await this.studentService.findOneByUser(userId);
    HttpResponseService.sendSuccess<Student>(res, HttpStatus.OK, result);
  }

  /**
   * Find a Student by user_id+9-
   * @param id _id of the Student
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Student,
  })
  @RequirePrivilege(PrivilegeName.VIEW_STUDENT)
  @Get('educationalClasses/:id')
  async getStudentByEducationalClassesId(
    @Param('id') educationalClassesId: string,
    @Res() res: FastifyReply,
  ) {
    const result = await this.studentService.getStudentByEducationalClassesId(
      educationalClassesId,
    );
    HttpResponseService.sendSuccess<Student[]>(res, HttpStatus.OK, result);
  }

  /**
   * Update Student
   * @param id _id of Student
   * @param updateStudentDto update of Student
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated student record',
    type: Student,
  })
  @RequirePrivilege(PrivilegeName.EDIT_STUDENT, PrivilegeName.EDIT_PROFILE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: HistoryWithData,
    @Res() res: FastifyReply,
  ) {
    const result = await this.studentService.update(id, updateStudentDto);
    HttpResponseService.sendSuccess<Student>(res, HttpStatus.OK, result);
  }

  /**
   * Update Student Results
   * @param id _id of Student
   * @param updateStudentResultDto update of Student
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated student record',
    type: Student,
  })
  @RequirePrivilege(PrivilegeName.EDIT_STUDENT, PrivilegeName.EDIT_PROFILE)
  @Patch('/result/:id')
  async updateStudentResult(
    @Param('id') id: string,
    @Body() updateStudentResultsDto: HistoryWithData | any,
    @Res() res: FastifyReply,
  ) {
    const result = await this.studentService.updateStudentResult(
      id,
      updateStudentResultsDto,
    );
    HttpResponseService.sendSuccess<Student>(res, HttpStatus.OK, result);
  }

  /**
   * Find a Student by user_id+9-
   * @param id _id of the Student
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Student,
  })
  @RequirePrivilege(PrivilegeName.VIEW_PROFILE)
  @Get('result/:id')
  async findResultByCourseId(
    @Param('id') courseId: string,
    @Res() res: FastifyReply,
  ) {
    const result = await this.studentService.getResultByCourseId(
      courseId,
    );
    HttpResponseService.sendSuccess<Student>(res, HttpStatus.OK, result);
  }

  
  /**
   * Remove Student with specific _id
   * @param id _id of Student to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_STUDENT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.studentService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }

  /**
   * Get Educational count
   * @param res
   */
  @Get('educational-classes-count')
  async getEducationalClassesCount(@Res() res: FastifyReply) {
    const result = await this.studentService.getEducationalClasseCount();
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }
}
