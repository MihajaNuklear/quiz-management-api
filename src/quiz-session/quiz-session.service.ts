import { Injectable } from '@nestjs/common';
import { QuizSessionRepository } from './quiz-session.repository';
import { CreateQuizSessionDto } from './dto/create-quiz-session.dto';
import { UpdateQuizSessionDto } from './dto/update-quiz-session.dto';
import { QuestionResult } from './entities/quiz-session.entity';
import { QuestionService } from '../question/question.service';

@Injectable()
export class QuizSessionService {
  /**
   * Constructor of quizSessionService
   * @param quizSessionRepository Injected QuizSession Repository
   */
  constructor(
    private readonly QuizSessionRepository: QuizSessionRepository,
    private readonly questionService: QuestionService,
  ) {}

  /**
   * Create a QuizSession
   * @param createQuizSessionDto QuizSession to be created
   * @returns Created QuizSession
   */

  async create(createQuizSessionDto: CreateQuizSessionDto) {
    const { user, quiz } = createQuizSessionDto;
    await this.updateQuestionAlreadyUsed(quiz);
    const session = await this.QuizSessionRepository.create(
      createQuizSessionDto,
    );
    const sessionWithCorrection = await this.QuizSessionRepository.findById(
      session._id as string,
    ).populate([{ path: 'quiz', populate: { path: 'question' } }]);
    return sessionWithCorrection;
  }

  /**
   * update Question Already Used
   */
  async updateQuestionAlreadyUsed(listQuestionResult: QuestionResult[]) {
    const today = new Date();
    const dateString = today.toLocaleDateString();
    const timeString = today.toLocaleTimeString();
    listQuestionResult.map((questionResult: QuestionResult) => {
      this.questionService.update(questionResult.question as string, {
        wasUsedDate: dateString,
        wasUsedTime: timeString,
      });
    });
  }

  /**
   * Get list of all QuizSessions
   * @returns List of all QuizSessions
   */
  async findAll() {
    const result = await this.QuizSessionRepository.find({});
    return result;
  }

  /**
   * Find QuizSession with specific id
   * @param id _id of QuizSession
   * @returns QuizSession corresponding to id, otherwise undefined
   */

  async findOne(id: string) {
    const result = await this.QuizSessionRepository.findById(id);
    return result;
  }

  /**
   * Update QuizSession with specific Id
   * @param id Id of QuizSession
   * @param updateQuizSessionDto Partial of QuizSession containing the update
   * @returns Updated QuizSession
   */

  async update(id: string, updateQuizSessionDto: UpdateQuizSessionDto) {
    const result = await this.QuizSessionRepository.update(
      id,
      updateQuizSessionDto,
    );
    return result;
  }

  /**
   * Remove QuizSession with specific id
   * @param id Id of QuizSession
   * @returns true if deletion is successful
   */

  async remove(id: string) {
    const result = await this.QuizSessionRepository.delete(id);
    return result;
  }
}
