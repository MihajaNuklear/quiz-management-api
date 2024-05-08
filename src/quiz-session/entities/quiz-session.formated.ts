import { Choice } from 'src/question/entities/question.entity';

export interface QuizSessionFormated {
  _id: string;
  quizNumber: string;
  quiz: QuestionResultFormated[];
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestionResultFormated {
  _id: string;
  userAnswer: string;
  trueAnswer: string;
  isValidAnswer?: boolean;
  question: QuestionFormated;
}

export interface QuestionFormated {
  _id: string;
  questionNumber: string;
  questionAsked: string;
  choice: Choice[];
  wasUsedDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
