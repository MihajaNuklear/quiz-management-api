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
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
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
  @Post()
  async create(
    @Body() createQuizSessionDto: CreateQuizSessionDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.QuizSessionService.create(createQuizSessionDto);
    HttpResponseService.sendSuccess<QuizSession>(
      res,
      HttpStatus.CREATED,
      result,
    );
  }

  /**
   * Get all QuizSessions inside database
   * @param res Fastify response
   */
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

  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.QuizSessionService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
