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
import { AdministrationService } from './administration.service';
import { CreateAdministrationDto } from './dto/create-administration.dto';
import { UpdateAdministrationDto } from './dto/update-administration.dto';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import {
  Privilege,
  PrivilegeName,
} from '../privilege/entities/privilege.entity';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { Administration } from './entities/administration.entity';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedAdministration } from './paginated-administration.interface';
@Controller('administration')
export class AdministrationController {
  constructor(private readonly administrationService: AdministrationService) {}

  @RequirePrivilege(PrivilegeName.CREATE_ADMINISTRATION)
  @Post()
  async create(
    @Body() createAdministrationDto: CreateAdministrationDto,
    @Res() res: FastifyReply,
  ) {
    const results = await this.administrationService.create(
      createAdministrationDto,
    );
    HttpResponseService.sendSuccess<Administration>(
      res,
      HttpStatus.CREATED,
      results,
    );
  }

  @RequirePrivilege(PrivilegeName.VIEW_ADMINISTRATION)
  @Get()
  async findAll(@Res() res: FastifyReply) {
    const results = await this.administrationService.findAll();
    HttpResponseService.sendSuccess<Administration[]>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Get paginated Administration
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
    const results: PaginatedAdministration =
      await this.administrationService.getPaginated(queryParams);
    HttpResponseService.sendSuccess<PaginatedAdministration>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  @RequirePrivilege(PrivilegeName.VIEW_ADMINISTRATION)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const results = await this.administrationService.findOne(id);
    HttpResponseService.sendSuccess<Administration>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  @RequirePrivilege(PrivilegeName.EDIT_ADMINISTRATION)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdministrationDto: UpdateAdministrationDto,
    @Res() res: FastifyReply,
  ) {
    const results = await this.administrationService.update(
      id,
      updateAdministrationDto,
    );
    HttpResponseService.sendSuccess<Administration>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  @RequirePrivilege(PrivilegeName.EDIT_ADMINISTRATION)
  @Patch('update/:id')
  async updateAdministration(
    @Param('id') id: string,
    @Body() updateAdministrationDto: UpdateAdministrationDto,
    @Res() res: FastifyReply,
  ) {
    const results = await this.administrationService.updateAministration(
      id,
      updateAdministrationDto,
    );
    HttpResponseService.sendSuccess<Administration>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  @RequirePrivilege(PrivilegeName.DELETE_ADMINISTRATION)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const results = await this.administrationService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, results);
  }
}
