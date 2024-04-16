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
import { ApplicationService } from './application.service';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { FastifyReply } from 'fastify';
import { Application } from './entities/application.entity';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { TasksDetailsDto } from './dto/tasksDetails.dto';
import { TasksStatusDto } from './dto/tasksStatus.dto';
import { MailQueueService } from '../mail-queue/mail-queue.service';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedApplication } from './paginated-application.interface';
import { HistoryWithData } from '../history/dto/create-history-with-data';
@Controller('application')
export class ApplicationController {
  constructor(
    private readonly ApplicationService: ApplicationService,
    private readonly mailQueueService: MailQueueService,
  ) {}

  /**
   * Dont Have a Permission
   * Create Application
   * @param createApplicationDto
   * @param res
   */
  @Post()
  async createCandidate(
    @Body() createCandidateDto: any,
    @Res() res: FastifyReply,
  ) {
    const result = await this.ApplicationService.createCandidate(
      createCandidateDto,
    );
    HttpResponseService.sendSuccess<Application>(
      res,
      HttpStatus.CREATED,
      result,
    );
  }

  /**
   * Find All Application
   * @param res
   */
  @RequirePrivilege(PrivilegeName.VIEW_APPLICATION)
  @Get()
  async findAll(@Res() res: FastifyReply) {
    const result = await this.ApplicationService.findAll();
    HttpResponseService.sendSuccess<Application[]>(res, HttpStatus.OK, result);
  }

  /**
   * Get paginated Application
   * @param ListCriteria
   * @param res
   */
  //@RequirePrivilege(PrivilegeName.VIEW_APPLICATION)
  @Get('list')
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: PaginatedApplication =
      await this.ApplicationService.getPaginated(queryParams);

    HttpResponseService.sendSuccess<PaginatedApplication>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Get application count of each status
   * @param res
   */
  //@RequirePrivilege(PrivilegeName.VIEW_APPLICATION)
  @Get('stat')
  async getCount(@Res() res: FastifyReply) {
    const result = await this.ApplicationService.getCount();
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }

  /**
   * Get application count of each status
   * @param res
   */
  //@RequirePrivilege(PrivilegeName.VIEW_APPLICATION)
  @Get('status-count')
  async getStatusCount(@Res() res: FastifyReply) {
    const result = await this.ApplicationService.getStatusCount();
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }

  /**
   * Find on Application
   * @param id
   * @param res
   */
  @RequirePrivilege(PrivilegeName.VIEW_APPLICATION, PrivilegeName.VIEW_PROFILE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.ApplicationService.findOne(id);
    HttpResponseService.sendSuccess<Application>(res, HttpStatus.OK, result);
  }

  /**
   * Find on Application userId
   * @param userId
   * @param res
   */
  @RequirePrivilege(PrivilegeName.VIEW_PROFILE)
  @Get('byUser/:userId')
  async findByUserId(
    @Param('userId') userId: string,
    @Res() res: FastifyReply,
  ) {
    const result = await this.ApplicationService.findByUserId(userId);
    HttpResponseService.sendSuccess<Application>(res, HttpStatus.OK, result);
  }

  /**
   * update application
   * @param id
   * @param updateApplicationDto
   * @param res
   */
  @RequirePrivilege(PrivilegeName.EDIT_APPLICATION)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
    @Res() res: FastifyReply,
  ) {

    const result = await this.ApplicationService.update(
      id,
      updateApplicationDto,
    );

    HttpResponseService.sendSuccess<Application>(res, HttpStatus.OK, result);
  }

  /**
   * update the tasks details application
   * @param id
   * @param updateTaskDetailsDto
   * @param res
   */
  @RequirePrivilege(PrivilegeName.EDIT_APPLICATION)
  @Patch('tasks-details/:id')
  async updateTasks(
    @Param('id') id: string,
    @Body() taskDetailsDto: TasksDetailsDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.ApplicationService.updateTaskDetails(
      id,
      taskDetailsDto,
    );
    HttpResponseService.sendSuccess<Application>(res, HttpStatus.OK, result);
  }

  /**
   * update the tasks details application
   * @param id
   * @param updateTaskDetailsDto
   * @param res
   */
  @RequirePrivilege(PrivilegeName.EDIT_APPLICATION)
  @Patch('tasks-status/:id')
  async updateTasksStatus(
    @Param('id') id: string,
    @Body() taskStatussDto: TasksStatusDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.ApplicationService.updateTaskStatus(
      id,
      taskStatussDto,
    );
    HttpResponseService.sendSuccess<Application>(res, HttpStatus.OK, result);
  }

  /**
   * update the tasks details application
   * @param id
   * @param updateTaskDetailsDto
   * @param res
   */
  @RequirePrivilege(PrivilegeName.EDIT_APPLICATION)
  @Patch('update/:id')
  async updateApplication(
    @Param('id') id: string,
    @Body() updateDto: any,
    @Res() res: FastifyReply,
  ) {
    const result = await this.ApplicationService.UpdateApplication(
      id,
      updateDto,
    );
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }

  @Patch('updateStatus/:id')
  async updatestatus(
    @Param('id') id: string,
    @Body() updateStatusDto: HistoryWithData,
    @Res() res: FastifyReply,
  ) {
    const result = await this.ApplicationService.updateStatus(
      id,
      updateStatusDto,
    );
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }

  /**
   * Delete application
   * @param id
   * @param res
   */
  @RequirePrivilege(PrivilegeName.DELETE_APPLICATION)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.ApplicationService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
