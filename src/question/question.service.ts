import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { HistoryService } from '../history/history.service';
 
 

@Injectable()
export class QuestionService {
  /**
   * Constructor of questionService
   * @param questionRepository Injected Question Repository
   */
  constructor(
    private readonly QuestionRepository: QuestionRepository,
    private readonly historyService: HistoryService,
 
  ) {}

  /**
   * Create a Question
   * @param createQuestionDto Question to be created
   * @returns Created Question
   */

  async create(createQuestionDto: CreateQuestionDto) {
    const result = await this.QuestionRepository.create(createQuestionDto);
    return result;
  }

  /**
   * Get list of all Questions
   * @returns List of all Questions
   */
  async findAll() {
    const result = await this.QuestionRepository.find({});
    return result;
  }

  /**
   * Find Question with specific id
   * @param id _id of Question
   * @returns Question corresponding to id, otherwise undefined
   */

  async findOne(id: string) {
    const result = await this.QuestionRepository.findById(id);
    return result;
  }

  /**
   * Update Question with specific Id
   * @param id Id of Question
   * @param updateQuestionDto Partial of Question containing the update
   * @returns Updated Question
   */

  async update(id: string, updateQuestionDto: UpdateQuestionDto) {
    const result = await this.QuestionRepository.update(id, updateQuestionDto);
    return result;
  }

  /**
   * Remove Question with specific id
   * @param id Id of Question
   * @returns true if deletion is successful
   */

  async remove(id: string) {
    const result = await this.QuestionRepository.delete(id);
    return result;
  }

    /**
   * Generate Username Question Number
 
   * @returns Username Question Number with based name
   */
    // async generatingUsernameQuestion(): Promise<string> {
    //   let count = 1;
    //   const countQueue: any | null = await this.countRepository.findOne({});
    //   const lastCount = countQueue.countQuestionValue;
    //   count = lastCount === 0 ? 1 : lastCount + 1;
    //   const newUsername = `${STUDENT_BASE_USERNAME}${count
    //     .toString()
    //     .padStart(4, '0')}`;
    //   await this.countRepository.update(countQueue._id, {
    //     countQuestionValue: count,
    //   });
    //   return newUsername;
    // }
 
}
