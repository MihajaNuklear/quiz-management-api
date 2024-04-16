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
import { CommentService } from './comment.service';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FastifyReply } from 'fastify';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { Commentary } from './entities/comment.entity';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { HistoryWithData } from '../history/dto/create-history-with-data';

@Controller('commentary')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  /**
   * Create comment
   * @param createCommentDto comment that will be created
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created comment record',
    type: Commentary,
  })
  @RequirePrivilege(PrivilegeName.CREATE_COMMENT)
  @Post()
  async create(
    @Body() createCommentDto: HistoryWithData,
    @Res() res: FastifyReply,
  ) {
    const result = await this.commentService.create(createCommentDto);
    HttpResponseService.sendSuccess<Commentary>(
      res,
      HttpStatus.CREATED,
      result,
    );
  }
  /**
   * Get all Commentary inside database
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'All comment records found',
    type: Commentary,
    isArray: true,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COMMENT)
  @Get('/all')
  async findAll(@Res() res: FastifyReply) {
    const results: Commentary[] = await this.commentService.findAll();
    HttpResponseService.sendSuccess<Commentary[]>(res, HttpStatus.OK, results);
  }

  /**
   * Find a Comment by its _id
   * @param id _id of the Commentary
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: Commentary,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COMMENT)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.commentService.findOne(id);
    HttpResponseService.sendSuccess<Commentary>(res, HttpStatus.OK, result);
  }

  /**
   * Find a Comment by its _id
   * @param id _id of the Commentary
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the target id',
    type: Commentary,
  })
  @RequirePrivilege(PrivilegeName.VIEW_COMMENT)
  @Get('target/:id')
  async findByTargetId(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.commentService.findByTargetId(id);
    HttpResponseService.sendSuccess<Commentary>(res, HttpStatus.OK, result);
  }

  /**
   * Update comment
   * @param id _id of Comment
   * @param updateCommentDto update of Comment
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated student record',
    type: Commentary,
  })
  @RequirePrivilege(PrivilegeName.EDIT_COMMENT)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.commentService.update(id, updateCommentDto);
    HttpResponseService.sendSuccess<Commentary>(res, HttpStatus.OK, result);
  }

  /**
   * Update comment
   * @param id _id of Comment
   * @param updateCommentDto update of Comment
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The updated comment record',
    type: Commentary,
  })
  @RequirePrivilege(PrivilegeName.EDIT_COMMENT)
  @Patch('updateCommentary/:id')
  async updateCommentary(
    @Param('id') id: string,
    @Body() updateCommentDto: HistoryWithData,
    @Res() res: FastifyReply,
  ) {
    const result = await this.commentService.updateCommentary(
      id,
      updateCommentDto,
    );
    HttpResponseService.sendSuccess<Commentary>(res, HttpStatus.OK, result);
  }

  /**
   * Remove Commentary with specific _id
   * @param id _id of Commentary to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_COMMENT)
  @Delete(':id')
  async remove(@Param('id') id: string, @Body() history, @Res() res) {
    const result = await this.commentService.remove(id, history);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }
}
