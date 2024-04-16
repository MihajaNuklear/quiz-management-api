import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationPeriodService } from './registration-period.service';

describe('RegistrationPeriodService', () => {
  let service: RegistrationPeriodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RegistrationPeriodService],
    }).compile();

    service = module.get<RegistrationPeriodService>(RegistrationPeriodService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
