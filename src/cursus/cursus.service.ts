import { Injectable } from '@nestjs/common';
import { CursusRepository } from './cursus.repository';
import { CreateCursusDto } from './dto/create-cursus.dto';
import { UpdateCursusDto } from './dto/update-cursus.dto';
import { CursusAndHistory } from './entities/cursus.entity';
import { ActionName } from '../history/entity/history.entity';
import { HistoryService } from '../history/history.service';

@Injectable()
export class CursusService {
  /**
   * Constructor of cursusService
   * @param cursusRepository Injected Cursus Repository
   */
  constructor(
    private readonly CursusRepository: CursusRepository,
    private readonly historyService: HistoryService,
  ) {}

  /**
   * Create a Cursus
   * @param createCursusDto Cursus to be created
   * @returns Created Cursus
   */

  async create(createCursusDto: CreateCursusDto) {
    const result = await this.CursusRepository.create(createCursusDto);
    return result;
  }

  /**
   * Get list of all Cursuss
   * @returns List of all Cursuss
   */
  async findAll() {
    const result = await this.CursusRepository.find({});
    return result;
  }

  /**
   * Find Cursus with specific id
   * @param id _id of Cursus
   * @returns Cursus corresponding to id, otherwise undefined
   */

  async findOne(id: string) {
    const result = await this.CursusRepository.findById(id);
    return result;
  }

  /**
   * Update Cursus with specific Id
   * @param id Id of Cursus
   * @param updateCursusDto Partial of Cursus containing the update
   * @returns Updated Cursus
   */

  async update(id: string, updateCursusDto: UpdateCursusDto) {
    const result = await this.CursusRepository.update(id, updateCursusDto);
    return result;
  }

  /**
   * Remove Cursus with specific id
   * @param id Id of Cursus
   * @returns true if deletion is successful
   */

  async remove(id: string) {
    const result = await this.CursusRepository.delete(id);
    return result;
  }

  /**
   * Create a Cursus
   * @param cursusList Cursus mutliple that will be modify
   * @returns Created Cursus
   */

  async multipleModification(cursusList: CursusAndHistory[]): Promise<any> {
    cursusList.map(async (cursusItem: CursusAndHistory) => {
      if (cursusItem.history.action.name == ActionName.CREATE_CURSUS) {
        let { name, description } = cursusItem.cursus;
        let addResponse = await this.CursusRepository.create({
          name,
          description,
        });
        cursusItem.history.targetId = addResponse._id.toString();
        this.historyService.create(cursusItem.history);
      } else if (cursusItem.history.action.name == ActionName.UPDATE_CURSUS) {
        await this.CursusRepository.update(cursusItem.cursus._id as string, {
          ...cursusItem.cursus,
        });
        await this.historyService.create(cursusItem.history);
      }
    });
  }
}
