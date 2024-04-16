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
import { CursusService } from './cursus.service';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { CreateCursusDto } from './dto/create-cursus.dto';
import { Cursus, CursusAndHistory } from './entities/cursus.entity';
import { UpdateCursusDto } from './dto/update-cursus.dto';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';

@Controller('cursus')
export class CursusController {
  constructor(private readonly CursusService: CursusService) {}

  /**
   * Create cursus
   * @param createCursusDto Cursus that will be created
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.CREATE_CURSUS)
  @Post()
  async create(
    @Body() createCursusDto: CreateCursusDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.CursusService.create(createCursusDto);
    HttpResponseService.sendSuccess<Cursus>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Cursuss inside database
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_CURSUS)
  @Get()
  async findAll(@Res() res: FastifyReply) {
    const result = await this.CursusService.findAll();
    HttpResponseService.sendSuccess<Cursus[]>(res, HttpStatus.OK, result);
  }

  /**
   * Find a Cursus by its _id
   * @param id _id of the Cursus
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_CURSUS)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.CursusService.findOne(id);
    HttpResponseService.sendSuccess<Cursus>(res, HttpStatus.OK, result);
  }

  /**
   * Update Cursus
   * @param id _id of Cursus
   * @param updateCursusDto update of Cursus
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.EDIT_CURSUS)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCursusDto: UpdateCursusDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.CursusService.update(id, updateCursusDto);
    HttpResponseService.sendSuccess<Cursus>(res, HttpStatus.OK, result);
  }
  /**
   * Remove Cursus with specific _id
   * @param id _id of Cursus to be deleted
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.DELETE_CURSUS)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.CursusService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }

  /**
   * Create cursus
   * @param createCursusDto Cursus mutliple that will be modify
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.CREATE_CURSUS)
  @Post('multipleModification')
  async multipleModification(
    @Body() createCursusDto: CursusAndHistory[],
    @Res() res: FastifyReply,
  ) {
    const result = await this.CursusService.multipleModification(
      createCursusDto,
    );
    HttpResponseService.sendSuccess<Cursus>(res, HttpStatus.OK);
  }
}
