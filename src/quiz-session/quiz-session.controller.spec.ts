import { Test, TestingModule } from '@nestjs/testing';
import { QuizSessionController } from './quiz-session.controller';
import { QuizSessionService } from './quiz-session.service';

describe('QuizSessionController', () => {
  let controller: QuizSessionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuizSessionController],
      providers: [QuizSessionService],
    }).compile();

    controller = module.get<QuizSessionController>(QuizSessionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
