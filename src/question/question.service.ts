import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { CountRepository } from '../count/count.repository';
import { ListCriteria } from 'src/shared/types/list-criteria.class';
import { PaginatedQuestion } from './paginated-question.interface';
import {
  QUESTION_SEARCH_FIELDS,
  QUESTIONS_LOOKUP_STAGES,
} from './question.constant';
import { QuestionCriteria } from './question.controller';

@Injectable()
export class QuestionService {
  /**
   * Constructor of questionService
   * @param questionRepository Injected Question Repository
   */
  constructor(
    private readonly QuestionRepository: QuestionRepository,
    private readonly countRepository: CountRepository,
  ) {}

  /**
   * Create a Question
   * @param createQuestionDto Question to be created
   * @returns Created Question
   */

  async create(createQuestionDto: CreateQuestionDto) {
    const questionNumber = await this.generatingUsernameQuestion();
    const result = await this.QuestionRepository.create({
      ...createQuestionDto,
      questionNumber: questionNumber,
    });
    return result;
  }

  /**
   * Get list of all Questions
   * @returns List of all Questions
   */
  async findAllWithoutAnswer(criteria: QuestionCriteria) {
    const limitDate = new Date(Date.now() - criteria.unusedSince * 1000);

    const questionsWithoutAnswer = await this.QuestionRepository.find({
      $or: [
        { wasUsedDate: { $lt: limitDate } },
        { wasUsedDate: { $exists: false } },
      ],
    })
      .select('-trueAnswer')
      .limit(50);

    const selectedQuestions = this.getRandomQuestions(
      questionsWithoutAnswer,
      criteria.size,
    );
    return selectedQuestions;
  }

  /**
   * Get paginated Questions based on list criteria
   * @param criteria Criteria used to filter Questions
   * @returns Paginated Questions, questionNames and questionDescriptions for filter
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedQuestion> {
    const paginatedQuestion = await this.QuestionRepository.getByListCriteria(
      criteria,
      QUESTION_SEARCH_FIELDS,
      QUESTIONS_LOOKUP_STAGES,
    );

    return {
      ...paginatedQuestion,
      pageNumber: Math.ceil(paginatedQuestion.totalItems / criteria.pageSize),
    };
  }
  /**
   * Get list of random Questions not already used
   * @returns List of Questions not already used
   */

  getRandomQuestions(questions: any[], size: number) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
  }
  /**
   * Get list of all Questions
   * @returns List of all Questions
   */
  async findAllWithAnswer(size: number) {
    const result = await this.QuestionRepository.find({}).limit(size);
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
  async generatingUsernameQuestion(): Promise<number> {
    let count = 1;
    const countQueue: any | null = await this.countRepository.findOne({});
    const lastCount = countQueue.countQuestionValue;
    count = lastCount === 0 ? 1 : lastCount + 1;
    await this.countRepository.update(countQueue._id, {
      countQuestionValue: count,
    });
    return count;
  }
}
