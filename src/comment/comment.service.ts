import { Injectable } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentRepository } from './comment.repository';
import { Commentary } from './entities/comment.entity';
import { History } from '../history/entity/history.entity';
import { HistoryService } from '../history/history.service';
import { HistoryWithData } from '../history/dto/create-history-with-data';

@Injectable()
export class CommentService {
  /**
   * Constructor of commentService
   * @param commentRepository Injected Comment Repository
   */
  constructor(
    private readonly commentRepository: CommentRepository,
    private readonly historyService: HistoryService,
  ) {}

  /**
   * Create a Comment
   * @param createCommentDto Comment to be created
   * @returns Created Comment
   */
  async create(createCommentDto: HistoryWithData): Promise<any> {
    const { data, history } = createCommentDto;

    const { comment } = data;

    const response = this.commentRepository.create(comment);
    if (response) {
      return this.historyService.create(history);
    } else {
      return null;
    }
  }

  /**
   * Get list of all Comment
   * @returns List of all Comment
   */
  findAll(): Promise<Commentary[]> {
    return this.commentRepository.find({}).populate({
      path: 'user',
      match: { isDelete: false },
    });
  }

  /**
   * Find Commentary with specific id
   * @param id _id of Commentary
   * @returns Comment corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Commentary | undefined> {
    return this.commentRepository.findById(id).populate('user');
  }

  /**
   * Find Commentary with specific id
   * @param id _id of Commentary
   * @returns Comment corresponding to id, otherwise undefined
   */
  async findByTargetId(targetId: string): Promise<any | undefined> {
    return this.commentRepository
      .find({ targetId })
      .populate('user')
      .sort({ updatedAt: -1 });
  }

  /**
   * Update comment with specific Id
   * @param id Id of Comment
   * @param updateCommentDto Partial of Comment containing the update
   * @returns Updated Comment
   */
  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
  ): Promise<Commentary> {
    const updatedComment = await this.commentRepository.update(
      id,
      updateCommentDto,
    );
    return updatedComment;
  }

  /**
   * Update comment with specific Id
   * @param id Id of Comment
   * @param updateCommentDto update only comment
   * @returns Updated Comment
   */
  async updateCommentary(
    id: string,
    updateCommentDto: HistoryWithData,
  ): Promise<any> {
    const { data, history } = updateCommentDto;

    const { comment } = data;

    const updatedComment = await this.commentRepository.update(id, {
      comment: comment,
    });
    if (updatedComment) {
      this.historyService.create(history);
    } else {
      return null;
    }
    return updatedComment;
  }

  /**
   * Remove Comment with specific id
   * @param id Id of Comment
   * @returns true if deletion is successful
   */
  async remove(id: string, history: History): Promise<boolean> {
    const response = this.commentRepository.delete(id);
    if (response) {
      this.historyService.create(history);
    }
    return response;
  }
}
