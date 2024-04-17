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
import { QuestionService } from './question.service';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Question } from './entities/question.entity';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';

@Controller('question')
export class QuestionController {
  constructor(private readonly QuestionService: QuestionService) {}

  /**
   * Create question
   * @param createQuestionDto Question that will be created
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.CREATE_QUIZ)
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
  @RequirePrivilege(PrivilegeName.VIEW_QUIZ)
  @Get('')
  async findAllWithoutAnswer(@Res() res: FastifyReply) {
    const result = await this.QuestionService.findAllWithoutAnswer();
    HttpResponseService.sendSuccess<Question[]>(res, HttpStatus.OK, result);
  }

  /**
   * Get all Questions inside database
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_QUIZ)
  @Get('answer')
  async findAllWithAnswer(@Res() res: FastifyReply) {
    const result = await this.QuestionService.findAllWithAnswer();
    HttpResponseService.sendSuccess<Question[]>(res, HttpStatus.OK, result);
  }

  /**
   * Find a Question by its _id
   * @param id _id of the Question
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_QUIZ)
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
  @RequirePrivilege(PrivilegeName.EDIT_QUIZ)
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
  @RequirePrivilege(PrivilegeName.DELETE_QUIZ)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuestionService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
