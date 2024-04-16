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
import { RegistrationPeriodService } from './registration-period.service';
import { CreateRegistrationPeriodDto } from './dto/create-registration-period.dto';
import { UpdateRegistrationPeriodDto } from './dto/update-registration-period.dto';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { FastifyReply } from 'fastify';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { RegistrationPeriod } from './entities/registration-period.entity';
@Controller('registration-period')
export class RegistrationPeriodController {
  constructor(
    private readonly registrationPeriodService: RegistrationPeriodService,
  ) {}

  /**
   * Create cursus
   * @param createRegistrationPeriodDto RegistrationPeriod that will be created
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.CREATE_CURSUS)
  @Post()
  async create(
    @Body() createRegistrationPeriodDto: CreateRegistrationPeriodDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.registrationPeriodService.create(
      createRegistrationPeriodDto,
    );
    HttpResponseService.sendSuccess<RegistrationPeriod>(
      res,
      HttpStatus.CREATED,
      result,
    );
  }

  // @RequirePrivilege(PrivilegeName.VIEW_CURSUS)
  @Get()
  async findAll(@Res() res: FastifyReply) {
    const result = await this.registrationPeriodService.findAll();
    HttpResponseService.sendSuccess<RegistrationPeriod[]>(
      res,
      HttpStatus.OK,
      result,
    );
  }

  @RequirePrivilege(PrivilegeName.VIEW_CURSUS)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.registrationPeriodService.findOne(id);
    HttpResponseService.sendSuccess<RegistrationPeriod>(
      res,
      HttpStatus.OK,
      result,
    );
  }

  @RequirePrivilege(PrivilegeName.EDIT_CURSUS)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRegistrationPeriodDto: UpdateRegistrationPeriodDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.registrationPeriodService.update(
      id,
      updateRegistrationPeriodDto,
    );
    HttpResponseService.sendSuccess<RegistrationPeriod>(
      res,
      HttpStatus.OK,
      result,
    );
  }

  @RequirePrivilege(PrivilegeName.DELETE_CURSUS)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.registrationPeriodService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
