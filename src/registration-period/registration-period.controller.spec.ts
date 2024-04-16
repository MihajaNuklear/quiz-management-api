import { Test, TestingModule } from '@nestjs/testing';
import { RegistrationPeriodController } from './registration-period.controller';
import { RegistrationPeriodService } from './registration-period.service';

describe('RegistrationPeriodController', () => {
  let controller: RegistrationPeriodController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegistrationPeriodController],
      providers: [RegistrationPeriodService],
    }).compile();

    controller = module.get<RegistrationPeriodController>(RegistrationPeriodController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
