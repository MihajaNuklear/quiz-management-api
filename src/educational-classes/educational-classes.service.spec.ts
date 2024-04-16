import { Test, TestingModule } from '@nestjs/testing';
import { EducationalClassesService } from './educational-classes.service';

describe('EducationalClassesService', () => {
  let service: EducationalClassesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EducationalClassesService],
    }).compile();

    service = module.get<EducationalClassesService>(EducationalClassesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
