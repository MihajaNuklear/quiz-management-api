import { Injectable } from '@nestjs/common';
import { QuizRepository } from './quiz.repository';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { HistoryService } from '../history/history.service';

@Injectable()
export class QuizService {
  /**
   * Constructor of quizService
   * @param quizRepository Injected Quiz Repository
   */
  constructor(
    private readonly QuizRepository: QuizRepository,
    private readonly historyService: HistoryService,
  ) {}

  /**
   * Create a Quiz
   * @param createQuizDto Quiz to be created
   * @returns Created Quiz
   */

  async create(createQuizDto: CreateQuizDto) {
    const result = await this.QuizRepository.create(createQuizDto);
    return result;
  }

  /**
   * Get list of all Quizs
   * @returns List of all Quizs
   */
  async findAll() {
    const result = await this.QuizRepository.find({});
    return result;
  }

  /**
   * Find Quiz with specific id
   * @param id _id of Quiz
   * @returns Quiz corresponding to id, otherwise undefined
   */

  async findOne(id: string) {
    const result = await this.QuizRepository.findById(id);
    return result;
  }

  /**
   * Update Quiz with specific Id
   * @param id Id of Quiz
   * @param updateQuizDto Partial of Quiz containing the update
   * @returns Updated Quiz
   */

  async update(id: string, updateQuizDto: UpdateQuizDto) {
    const result = await this.QuizRepository.update(id, updateQuizDto);
    return result;
  }

  /**
   * Remove Quiz with specific id
   * @param id Id of Quiz
   * @returns true if deletion is successful
   */

  async remove(id: string) {
    const result = await this.QuizRepository.delete(id);
    return result;
  }

  /**
   * Create a Quiz
   * @param quizList Quiz mutliple that will be modify
   * @returns Created Quiz
   */
 
}
