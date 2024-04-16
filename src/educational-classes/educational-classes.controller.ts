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
import { EducationalClassesService } from './educational-classes.service';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { EducationalClasses } from './entities/educational-classes.entity';
import { CreateeducationalClassesDto } from './dto/create-educational-classes.dto';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { UpdateeducationalClassesDto } from './dto/update-educational-classes.dto';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedEducationalClasses } from './paginated-educational-classes.interface';

@Controller('educational-classes')
export class EducationalClassesController {
  constructor(
    private readonly educationalClassesService: EducationalClassesService,
  ) {}

  /**
   * Find all educational classes
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'The created educationalClasses record',
    type: EducationalClasses,
  })
  @RequirePrivilege(PrivilegeName.VIEW_EDUCATIONAL_CLASSES)
  @Get('all')
  async findAll(@Res() res: FastifyReply) {
    const results: EducationalClasses[] =
      await this.educationalClassesService.findAll();
    HttpResponseService.sendSuccess<EducationalClasses[]>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Get paginated Educational class
   * @param ListCriteria
   * @param res
   */
  @RequirePrivilege(PrivilegeName.VIEW_APPLICATION)
  @Get('list')
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    console.log(queryParams);
    const results: PaginatedEducationalClasses =
      await this.educationalClassesService.getPaginated(queryParams);
    HttpResponseService.sendSuccess<PaginatedEducationalClasses>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Create educationalClasses
   * @param createeducationalClassesDto educationalClasses that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created educationalClasses record',
    type: EducationalClasses,
  })
  @RequirePrivilege(PrivilegeName.CREATE_EDUCATIONAL_CLASSES)
  @Post()
  async create(
    @Body() createeducationalClassesDto: CreateeducationalClassesDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.educationalClassesService.create(
      createeducationalClassesDto,
    );
    HttpResponseService.sendSuccess<EducationalClasses>(
      res,
      HttpStatus.CREATED,
      result,
    );
  }
  /**
   * Find a Group by its _id
   * @param id _id of the Group
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: EducationalClasses,
  })
  @RequirePrivilege(PrivilegeName.VIEW_EDUCATIONAL_CLASSES)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.educationalClassesService.findOne(id);
    HttpResponseService.sendSuccess<EducationalClasses>(
      res,
      HttpStatus.OK,
      result,
    );
  }

  /**
   * Update Group
   * @param id _id of Group
   * @param updateeducationalClassesDto update of Group
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated group record',
    type: EducationalClasses,
  })
  @RequirePrivilege(PrivilegeName.EDIT_EDUCATIONAL_CLASSES)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateeducationalClassesDto: UpdateeducationalClassesDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.educationalClassesService.update(
      id,
      updateeducationalClassesDto,
    );
    HttpResponseService.sendSuccess<EducationalClasses>(
      res,
      HttpStatus.OK,
      result,
    );
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
  @RequirePrivilege(PrivilegeName.DELETE_EDUCATIONAL_CLASSES)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.educationalClassesService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
