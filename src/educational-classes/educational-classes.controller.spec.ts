import { Test, TestingModule } from '@nestjs/testing';
import { EducationalClassesController } from './educational-classes.controller';
import { EducationalClassesService } from './educational-classes.service';

describe('EducationalClassesController', () => {
  let controller: EducationalClassesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EducationalClassesController],
      providers: [EducationalClassesService],
    }).compile();

    controller = module.get<EducationalClassesController>(EducationalClassesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
