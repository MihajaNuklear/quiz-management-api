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
import { QuestionService } from './question.service';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { ListCriteria } from 'src/shared/types/list-criteria.class';
import { PaginatedQuestion } from './paginated-question.interface';

export interface QuestionCriteria {
  unusedSince: number;
  size: number;
}
@Controller('question')
export class QuestionController {
  constructor(private readonly QuestionService: QuestionService) {}

  /**
   * Create question
   * @param createQuestionDto Question that will be created
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.CREATE_QUESTION)
  @Post()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuestionService.create(createQuestionDto);
    HttpResponseService.sendSuccess<Question>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Questions inside database without answer
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_QUESTION)
  @Get('no-answer')
  async findAllWithoutAnswer(
    @Query() queryParams: QuestionCriteria,
    @Res() res: FastifyReply,
  ) {
    const { unusedSince = 0, size = 50 } = queryParams;

    const result: any = await this.QuestionService.findAllWithoutAnswer({
      unusedSince,
      size,
    });
    HttpResponseService.sendSuccess<Question[]>(res, HttpStatus.OK, result);
  }

  /**
   * Get all Questions inside database
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_QUESTION)
  @Get('answer/:size?')
  async findAllWithAnswer(
    @Param('size') size: number,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuestionService.findAllWithAnswer(size);
    HttpResponseService.sendSuccess<Question[]>(res, HttpStatus.OK, result);
  }

  /**
   * Get paginated  Questions inside database
   * @param res Fastify response
   */

  @RequirePrivilege(PrivilegeName.VIEW_QUESTION)
  @Get('list')
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: PaginatedQuestion = await this.QuestionService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<PaginatedQuestion>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find a Question by its _id
   * @param id _id of the Question
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_QUESTION)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuestionService.findOne(id);
    HttpResponseService.sendSuccess<Question>(res, HttpStatus.OK, result);
  }

  /**
   * Update Question
   * @param id _id of Question
   * @param updateQuestionDto update of Question
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.EDIT_QUESTION)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuestionService.update(id, updateQuestionDto);
    HttpResponseService.sendSuccess<Question>(res, HttpStatus.OK, result);
  }
  /**
   * Remove Question with specific _id
   * @param id _id of Question to be deleted
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.DELETE_QUESTION)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuestionService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
