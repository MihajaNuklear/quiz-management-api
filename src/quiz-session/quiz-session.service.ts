import { Injectable } from '@nestjs/common';
import { QuizSessionRepository } from './quiz-session.repository';
import { CreateQuizSessionDto } from './dto/create-quiz-session.dto';
import { UpdateQuizSessionDto } from './dto/update-quiz-session.dto';
import { QuestionResult, QuizSession } from './entities/quiz-session.entity';
import { QuestionService } from '../question/question.service';
import { ListCriteria } from 'src/shared/types/list-criteria.class';
import { PaginatedQuizSession } from './paginated-quizSession.interface';
import {
  QUIZ_SESSIONS_LOOKUP_STAGES,
  QUIZ_SESSION_SEARCH_FIELDS,
} from './quiz-session.constant';
import { QuestionRepository } from '../question/question.repository';
import { CountRepository } from '../count/count.repository';
import {
  QuestionResultFormated,
  QuizSessionFormated,
} from './entities/quiz-session.formated';
import { Question } from 'src/question/entities/question.entity';
import { QuestionResultNotFormated } from './entities/quz-session.notFormated';

@Injectable()
export class QuizSessionService {
  /**
   * Constructor of quizSessionService
   * @param quizSessionRepository Injected QuizSession Repository
   */
  constructor(
    private readonly QuizSessionRepository: QuizSessionRepository,
    private readonly questionService: QuestionService,
    private readonly questionRepository: QuestionRepository,
    private readonly countRepository: CountRepository,
  ) {}

  /**
   * Create a QuizSession
   * @param createQuizSessionDto QuizSession to be created
   * @returns Created QuizSession
   */

  async create(createQuizSessionDto: CreateQuizSessionDto) {
    const quizNumber = await this.generatingUsernameQuiz();
    const questionResult: QuestionResult[] = createQuizSessionDto.quiz;
    const isUpdateQuestion = await this.updateQuestionAlreadyUsed(
      questionResult,
    );
    if (isUpdateQuestion) {
      await this.updateIsValidAnswer(createQuizSessionDto);
      const session = await this.QuizSessionRepository.create({
        ...createQuizSessionDto,
        quizNumber: quizNumber,
      });

      const sessionWithCorrection = await this.QuizSessionRepository.findById(
        session._id as string,
      ).populate([{ path: 'quiz', populate: { path: 'question' } }]);
      return this.formatQuizSessionResponse(sessionWithCorrection);
    }

    return null;
  }

  /**
   * format quiz session response
   */

  formatQuizSessionResponse(quizSession: any) {
    let quizSessionFormated: QuizSessionFormated;
    quizSessionFormated = {
      _id: quizSession._id,
      quizNumber: quizSession.quizNumber,
      quiz: this.formatQuiz(quizSession.quiz),
      createdAt: quizSession.createdAt,
      updatedAt: quizSession.updatedAt,
    };

    return quizSessionFormated;
  }

  /**
   * format quiz response
   */

  formatQuiz(quizList: QuestionResultNotFormated[]) {
    let quizFormated: QuestionResultFormated[] = quizList.map((quiz) => ({
      _id: quiz._id,
      userAnswer: quiz.userAnswer,
      trueAnswer: quiz.question.trueAnswer,
      isValidAnswer: quiz.isValidAnswer,
      question: {
        _id: quiz.question._id,
        questionNumber: quiz.question.questionNumber,
        questionAsked: quiz.question.questionAsked,
        choice: quiz.question.choice,
        wasUsedDate: quiz.question.wasUsedDate,
        createdAt: quiz.question.createdAt,
        updatedAt: quiz.question.updatedAt,
      },
    }));
    return quizFormated;
  }
  /**
   * update isValidAnswer
   */

  async updateIsValidAnswer(createQuizSessionDto: CreateQuizSessionDto) {
    const questionResult: QuestionResult[] = createQuizSessionDto.quiz;
    await Promise.all(
      questionResult.map(async (result, index) => {
        let question = await this.questionRepository.findById(
          result.question as string,
        );
        result.isValidAnswer = result.userAnswer == question.trueAnswer;
      }),
    );
  }

  /**
   * update Question Already Used
   */
  async updateQuestionAlreadyUsed(listQuestionResult: QuestionResult[]) {
    const allAnswerIsPresentInChoice: boolean =
      await this.checkAnswerIsPresentInChoice(listQuestionResult);
    if (allAnswerIsPresentInChoice) {
      listQuestionResult.map((questionResult: QuestionResult) => {
        this.questionService.update(questionResult.question as string, {
          wasUsedDate: new Date(),
        });
      });
    }
    return allAnswerIsPresentInChoice;
  }

  /**
   * check if all answer is present in choice
   */
  async checkAnswerIsPresentInChoice(listQuestionResult: QuestionResult[]) {
    let isPresentInChoice = true;

    for (const questionResult of listQuestionResult) {
      let question = await this.questionRepository.findById(
        questionResult.question as string,
      );

      isPresentInChoice = question.choice.some(
        (choiceItem) => choiceItem._id == questionResult.userAnswer,
      );

      if (!isPresentInChoice) {
        break;
      }
    }
    return isPresentInChoice;
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

  /**
 * Generate Username Quiz Number
 
 * @returns Username Quiz Number with based name
 */
  async generatingUsernameQuiz(): Promise<string> {
    let count = 1;
    const countQueue: any | null = await this.countRepository.findOne({});
    const lastCount = countQueue.countQuizValue;
    count = lastCount === 0 ? 1 : lastCount + 1;
    await this.countRepository.update(countQueue._id, {
      countQuizValue: count,
    });
    return count.toString();
  }
}
