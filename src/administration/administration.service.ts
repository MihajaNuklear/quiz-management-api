import { Injectable } from '@nestjs/common';
import { CreateAdministrationDto } from './dto/create-administration.dto';
import { UpdateAdministrationDto } from './dto/update-administration.dto';
import { AdministrationRepository } from './administration.repository';
import { PaginatedAdministration } from './paginated-administration.interface';
import { ListCriteria } from '../shared/types/list-criteria.class';
import {
  ADMINISTRATIONS_LOOKUP_STAGES,
  ADMINISTRATION_SEARCH_FIELDS,
} from './administration.constant';
import { User } from './../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { CountRepository } from '../count/count.repository';
import { HistoryService } from '../history/history.service';

@Injectable()
export class AdministrationService {
  constructor(
    private readonly administrationRepository: AdministrationRepository,
    private readonly countRepository: CountRepository,
    private readonly userService: UserService,
    private readonly historyService: HistoryService,
  ) {}
 
 async create(createAdministrationDto: CreateAdministrationDto) {
    const createdStudent = this.administrationRepository.create(createAdministrationDto);
    if(createdStudent){
    let count = 1;
    const countQueue: any | null = await this.countRepository.findOne({});
    const lastCount = countQueue.countAdministrationValue;
    count = lastCount === 0 ? 1 : lastCount + 1;
      await this.countRepository.update(countQueue._id, {
        countAdministrationValue: count,
      });
    return createdStudent;
    }
    return null;
  }

  findAll() {
    return this.administrationRepository.find({}).populate({
      path: 'user',
      match: { isDelete: false },
    });
  }
  /**
   * Get paginated Users and list of entity names and user fullNames, based on list criteria
   * @param criteria criteria used to find Users
   * @returns Paginated Users
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedAdministration> {
    const paginatedAdministration =
      await this.administrationRepository.getByListCriteria(
        criteria,
        ADMINISTRATION_SEARCH_FIELDS,
        ADMINISTRATIONS_LOOKUP_STAGES,
        {
          'user.isDelete': false,
        },
      );

    return {
      ...paginatedAdministration,
      pageNumber: Math.ceil(
        paginatedAdministration.totalItems / criteria.pageSize,
      ),
    };
  }

  findOne(id: string) {
    return this.administrationRepository.findById(id).populate([
      { path: 'user' },
      {
        path: 'user',
        populate: {
          path: 'groups',
        },
      },
      {
        path: 'user',
        populate: {
          path: 'roles',
        },
      },
    ]);
  }

  update(id: string, updateAdministrationDto: UpdateAdministrationDto) {
    return this.administrationRepository.update(id, updateAdministrationDto);
  }

  async updateAministration(id: string, updatedDto: any) {
    const updatedUser = await this.userService.update(
      updatedDto.data.user._id.toString(),
      {data:updatedDto.data.user,history:updatedDto.history}
    );
    if (updatedUser) {
    const updateAdmin = await this.update(id, updatedDto.data);    
    return updateAdmin;
    } else {
      throw new Error('Erreur sur la modification des données');
    }
  }

  remove(id: string) {
    return this.administrationRepository.delete(id);
  }
}
