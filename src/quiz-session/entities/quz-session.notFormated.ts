import { Choice } from 'src/question/entities/question.entity';

export interface QuizSessionNotFormated {
  _id: string;
  quizNumber: string;
  quiz: QuestionResultNotFormated[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionResultNotFormated {
  _id: string;
  userAnswer: string;
  isValidAnswer?: boolean;
  question: QuestionNotFormated;
}

export interface QuestionNotFormated {
  _id: string;
  questionNumber: string;
  trueAnswer: string;
  questionAsked: string;
  choice: Choice[];
  wasUsedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
