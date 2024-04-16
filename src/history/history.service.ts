import { Injectable } from '@nestjs/common';
import { HistoryRepository } from './history.repository';
import { CreateHistoryDto } from './dto/create-history.dto';
import { ActionName, History } from './entity/history.entity';
import { UpdateHistoryDto } from './dto/update-history.dto';
import * as faker from 'faker';

@Injectable()
export class HistoryService {
  /**
   * Constructor of historyService
   * @param historyRepository Injected History Repository
   */
  constructor(private readonly historyRepository: HistoryRepository) {}

  /**
   * Create a History
   * @param createHistoryDto History to be created
   * @returns Created History
   */
  async create(createHistoryDto: CreateHistoryDto): Promise<History> {
    return this.historyRepository.create(createHistoryDto);
  }

  /**
   * Get list of all History
   * @returns List of all History
   */
  findAll(): Promise<History[]> {
    return this.historyRepository.find({}).populate({
      path: 'user',
      match: { isDelete: false },
    });
  }
  /**
   * Find Historyary with specific id
   * @param id _id of Historyary
   * @returns History corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<History | undefined> {
    return this.historyRepository.findById(id).populate({
      path: 'user',
      match: { isDelete: false },
    });
  }

  /**
   * Find Historyary with specific id
   * @param id _id of Historyary
   * @returns History corresponding to id, otherwise undefined
   */
  async findOneByTargetId(
    targetId: string,
  ): Promise<History | undefined | any> {
    return this.historyRepository
      .find({ targetId })
      .populate({
        path: 'user',
        match: { isDelete: false },
      })
      .sort({ updatedAt: -1 });
  }

  /**
   * Find Historyary with specific id
   * @param id _id of Historyary
   * @returns History corresponding to id, otherwise undefined
   */
  async findAllByEntity(
    entityName: string,
  ): Promise<History | undefined | any> {
    return this.historyRepository
      .find({ entity: entityName })
      .populate({
        path: 'user',
        // match: { isDelete: false },
      })
      .sort({ updatedAt: -1 });
  }

  /**
   * Update comment with specific Id
   * @param id Id of History
   * @param updateHistoryDto Partial of History containing the update
   * @returns Updated History
   */
  async update(
    id: string,
    updateHistoryDto: UpdateHistoryDto,
  ): Promise<History> {
    const updatedHistory = await this.historyRepository.update(
      id,
      updateHistoryDto,
    );
    return updatedHistory;
  }

  /**
   * Remove History with specific id
   * @param id Id of History
   * @returns true if deletion is successful
   */
  async remove(id: string): Promise<boolean> {
    return this.historyRepository.delete(id);
  }

  async createFakeData(): Promise<History> {
    const fakeHistory: any = Array.from(new Array(30), (): any => {
      const data = {
        action: {
          name: faker.random.arrayElement(Object.values(ActionName)),
          proof: faker.random.arrayElement([
            '',
            'En attente d’interview',
            'Inscrits au Bootcamp',
            '',
            'En traitement',
            '',
          ]),
        },
        entity: faker.random.arrayElement([
          'Application',
          'Application',
          'Application',
          'User',
          'Comment',
          'Comment',
          'Comment',
        ]),
        targetId: faker.random.arrayElement([
          '65a52c6fbe4025b415586684',
          '65a52c6fbe4025b415586684',
          '65a52c6fbe4025b415586684',
          '65a52c6fbe4025b4155866aa',
          '65a52c6fbe4025b4155866be',
          '65a52c6fbe4025b4155866d2',
          '65a52c6fbe4025b4155866d2',
          '65a52c6fbe4025b4155866e4',
          '65a52c70be4025b4155866f7',
          '65a52c70be4025b41558670b',
        ]),
        user: faker.random.arrayElement([
          '65a52b218cee11f8bd88dcba',
          '65a52b218cee11f8bd88dcc2',
          '65a52b218cee11f8bd88dcc8',
        ]),
      };
      return data;
    });

    return this.historyRepository.create(fakeHistory);
  }
}
