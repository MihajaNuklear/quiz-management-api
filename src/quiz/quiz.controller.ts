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
import { QuizService } from './quiz.service';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { Quiz } from './entities/quiz.entity';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';

@Controller('quiz')
export class QuizController {
  constructor(private readonly QuizService: QuizService) {}

  /**
   * Create quiz
   * @param createQuizDto Quiz that will be created
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.CREATE_QUIZ)
  @Post()
  async create(
    @Body() createQuizDto: CreateQuizDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuizService.create(createQuizDto);
    HttpResponseService.sendSuccess<Quiz>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get all Quizs inside database
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_QUIZ)
  @Get()
  async findAll(@Res() res: FastifyReply) {
    const result = await this.QuizService.findAll();
    HttpResponseService.sendSuccess<Quiz[]>(res, HttpStatus.OK, result);
  }

  /**
   * Find a Quiz by its _id
   * @param id _id of the Quiz
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.VIEW_QUIZ)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuizService.findOne(id);
    HttpResponseService.sendSuccess<Quiz>(res, HttpStatus.OK, result);
  }

  /**
   * Update Quiz
   * @param id _id of Quiz
   * @param updateQuizDto update of Quiz
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.EDIT_QUIZ)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuizService.update(id, updateQuizDto);
    HttpResponseService.sendSuccess<Quiz>(res, HttpStatus.OK, result);
  }
  /**
   * Remove Quiz with specific _id
   * @param id _id of Quiz to be deleted
   * @param res Fastify response
   */
  @RequirePrivilege(PrivilegeName.DELETE_QUIZ)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuizService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
