import { Injectable } from '@nestjs/common';
import { CreateRegistrationPeriodDto } from './dto/create-registration-period.dto';
import { UpdateRegistrationPeriodDto } from './dto/update-registration-period.dto';
import { RegistrationPeriodRepository } from './registration-period.repository';
import { HistoryService } from '../history/history.service';

@Injectable()
export class RegistrationPeriodService {
  constructor(
    private readonly registrationPeriodRepository: RegistrationPeriodRepository,
    private readonly historyService: HistoryService,
  ) {}

  async create(createRegistrationPeriodDto: CreateRegistrationPeriodDto) {
    const result = await this.registrationPeriodRepository.create(
      createRegistrationPeriodDto,
    );
    return result;
  }

  async findAll() {
    const result = await this.registrationPeriodRepository.find({});
    return result;
  }

  async findOne(id: string) {
    const result = await this.registrationPeriodRepository.findById(id);
    return result;
  }

  async update(id: string, updateRegistrationPeriodDto: any) {
    const { registrationPeriod, history } = updateRegistrationPeriodDto;

    const result = await this.registrationPeriodRepository.update(
      id,
      registrationPeriod,
    );
    if (result) {
      this.historyService.create(history);
    } else {
      return null;
    }

    return result;
  }

  async remove(id: string) {
    const result = await this.registrationPeriodRepository.delete(id);
    return result;
  }
}
