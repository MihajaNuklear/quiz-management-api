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
  UseGuards,
} from '@nestjs/common';
import { QuizSessionService } from './quiz-session.service';
import { FastifyReply } from 'fastify';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { CreateQuizSessionDto } from './dto/create-quiz-session.dto';
import { QuizSession } from './entities/quiz-session.entity';
import { UpdateQuizSessionDto } from './dto/update-quiz-session.dto';

import { ListCriteria } from 'src/shared/types/list-criteria.class';
import { PaginatedQuizSession } from './paginated-quizSession.interface';
import { ApiKeyGuard } from './quiz-session.middleware';

@Controller('quizSession')
export class QuizSessionController {
  constructor(private readonly QuizSessionService: QuizSessionService) {}

  /**
   * Create quizSession
   * @param createQuizSessionDto QuizSession that will be created
   * @param res Fastify response
   */
  @UseGuards(ApiKeyGuard)
  @Post()
  async create(
    @Body() createQuizSessionDto: CreateQuizSessionDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuizSessionService.create(createQuizSessionDto);
    result
      ? HttpResponseService.sendSuccess<QuizSession>(
          res,
          HttpStatus.CREATED,
          result,
        )
      : HttpResponseService.sendError(res, HttpStatus.BAD_REQUEST, {
          type: 'invalid_data',
          title: 'Invalid Data Provided',
          message:
            'The format of the data sent is invalid. Please check the data and try again.',
        });
  }

  /**
   * Get all QuizSessions inside databasee
   * @param res Fastify response
   */
  @UseGuards(ApiKeyGuard)
  @Get()
  async findAll(@Res() res: FastifyReply) {
    const result = await this.QuizSessionService.findAll();
    HttpResponseService.sendSuccess<QuizSession[]>(res, HttpStatus.OK, result);
  }

  @UseGuards(ApiKeyGuard)
  @Get('list')
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    const results: PaginatedQuizSession =
      await this.QuizSessionService.getPaginated(queryParams);
    HttpResponseService.sendSuccess<PaginatedQuizSession>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find a QuizSession by its _id
   * @param id _id of the QuizSession
   * @param res Fastify response
   */
  @UseGuards(ApiKeyGuard)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuizSessionService.findOne(id);
    HttpResponseService.sendSuccess<QuizSession>(res, HttpStatus.OK, result);
  }

  /**
   * Update QuizSession
   * @param id _id of QuizSession
   * @param updateQuizSessionDto update of QuizSession
   * @param res Fastify response
   */
  @UseGuards(ApiKeyGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizSessionDto: UpdateQuizSessionDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuizSessionService.update(
      id,
      updateQuizSessionDto,
    );
    HttpResponseService.sendSuccess<QuizSession>(res, HttpStatus.OK, result);
  }
  /**
   * Remove QuizSession with specific _id
   * @param id _id of QuizSession to be deleted
   * @param res Fastify response
   */
  @UseGuards(ApiKeyGuard)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuizSessionService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
