import { Injectable } from '@nestjs/common';
import { QuizSessionRepository } from './quiz-session.repository';
import { CreateQuizSessionDto } from './dto/create-quiz-session.dto';
import { UpdateQuizSessionDto } from './dto/update-quiz-session.dto';
import { QuestionResult } from './entities/quiz-session.entity';
import { QuestionService } from '../question/question.service';
import { ListCriteria } from 'src/shared/types/list-criteria.class';
import { PaginatedQuizSession } from './paginated-quizSession.interface';
import {
  QUIZ_SESSIONS_LOOKUP_STAGES,
  QUIZ_SESSION_SEARCH_FIELDS,
} from './quiz-session.constant';
import { UserRepository } from '../user/user.repository';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class QuizSessionService {
  /**
   * Constructor of quizSessionService
   * @param quizSessionRepository Injected QuizSession Repository
   */
  constructor(
    private readonly QuizSessionRepository: QuizSessionRepository,
    private readonly questionService: QuestionService,
    private readonly userRepository: UserRepository,
  ) {}

  /**
   * Create a QuizSession
   * @param createQuizSessionDto QuizSession to be created
   * @returns Created QuizSession
   */

  async create(createQuizSessionDto: CreateQuizSessionDto) {
    const { user, quiz } = createQuizSessionDto;

    await this.updateQuestionAlreadyUsed(quiz);

    const isValidToCreateSession = await this.updateCountUsageEquestion(user);

    if (isValidToCreateSession) {
      const session = await this.QuizSessionRepository.create(
        createQuizSessionDto,
      );
      const sessionWithCorrection = await this.QuizSessionRepository.findById(
        session._id as string,
      ).populate([{ path: 'quiz', populate: { path: 'question' } }]);

      return sessionWithCorrection;
    }
    return null;
  }

  /**
   * update Question Count Usage Equestio
   */
  async updateCountUsageEquestion(userId: string) {
    const countUsageLimitPerDay = 5;
    
    const now = new Date();
    // const now = new Date('2024-04-23T19:21:11.081+00:00');

    const user: User = await this.userRepository.findById(userId);

    let isValidCount: boolean =
      user.countUsageEquestion >= countUsageLimitPerDay ? false : true;

    let isSameDate: boolean = this.compareDateWithoutHour(
      user.dateUsageEquestion,
      now,
    );

    if (isSameDate && isValidCount) {
      await this.userRepository.update(user._id as string, {
        countUsageEquestion: user.countUsageEquestion + 1,
        dateUsageEquestion: now,
      });
    } else if (isSameDate == false) {
      await this.userRepository.update(user._id as string, {
        countUsageEquestion: 1,
        dateUsageEquestion: now,
      });
      isValidCount = true;
      isSameDate = true;
    }
    const isValidToCreateSession: boolean =
      isValidCount == true && isSameDate == true;
    // console.log('===============================²');
    // console.log('isSameDate ', isSameDate);
    // console.log('isValidCount ', isValidCount);
    // console.log('isValidToCreateSession ', isValidToCreateSession);
    // console.log('===============================²');

    return isValidToCreateSession;
  }

  /**
   * Compare Date Without Hour
   */

  compareDateWithoutHour(date1: Date, date2: Date): boolean {
    const annee1 = date1.getFullYear();
    const mois1 = date1.getMonth();
    const jour1 = date1.getDate();

    const annee2 = date2.getFullYear();
    const mois2 = date2.getMonth();
    const jour2 = date2.getDate();

    return annee1 === annee2 && mois1 === mois2 && jour1 === jour2;
  }

  /**
   * update Question Already Used
   */
  async updateQuestionAlreadyUsed(listQuestionResult: QuestionResult[]) {
    listQuestionResult.map((questionResult: QuestionResult) => {
      this.questionService.update(questionResult.question as string, {
        wasUsedDate: new Date(),
      });
    });
  }

  /**
   * Get paginated Users and list of entity names and user fullNames, based on list criteria
   * @param criteria criteria used to find Users
   * @returns Paginated Users
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedQuizSession> {
    const paginatedRole = await this.QuizSessionRepository.getByListCriteria(
      criteria,
      QUIZ_SESSION_SEARCH_FIELDS,
      QUIZ_SESSIONS_LOOKUP_STAGES,
    );

    return {
      ...paginatedRole,
      pageNumber: Math.ceil(paginatedRole.totalItems / criteria.pageSize),
    };
  }

  /**
   * Get list of all QuizSessions
   * @returns List of all QuizSessions
   */
  async findAll() {
    const result = await this.QuizSessionRepository.find({}).populate([
      { path: 'user' },
    ]);
    return result;
  }

  /**
   * Find QuizSession with specific id
   * @param id _id of QuizSession
   * @returns QuizSession corresponding to id, otherwise undefined
   */

  async findOne(id: string) {
    const result = (await this.QuizSessionRepository.findById(id)).populate([
      { path: 'user' },
      { path: 'quiz', populate: { path: 'question' } },
    ]);
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
