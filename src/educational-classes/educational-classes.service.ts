import { Injectable } from '@nestjs/common';
import { EducationalClassesRepository } from './educational-classes.repository';
import { EducationalClasses } from './entities/educational-classes.entity';
import { CreateeducationalClassesDto } from './dto/create-educational-classes.dto';
import { UpdateeducationalClassesDto } from './dto/update-educational-classes.dto';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedEducationalClasses } from './paginated-educational-classes.interface';
import {
  EDUCATIONALCLASSES_LOOKUP_STAGES,
  EDUCATIONALCLASSES_SEARCH_FIELDS,
} from './educational-classes.constant';

@Injectable()
export class EducationalClassesService {
  constructor(
    private readonly educationalClassesRepository: EducationalClassesRepository,
  ) {}

  /**
   * Get list of all educationalClasses
   * @returns List of all educationalClasses
   */
  findAll(): Promise<EducationalClasses[]> {
    return this.educationalClassesRepository.find({}).populate(['cursus']);
  }

  /**
   * Get paginated Users and list of entity names and user fullNames, based on list criteria
   * @param criteria criteria used to find Users
   * @returns Paginated Users
   */
  async getPaginated(
    criteria: ListCriteria,
  ): Promise<PaginatedEducationalClasses> {
    const paginatedEducationalClasses =
      await this.educationalClassesRepository.getByListCriteria(
        criteria,
        EDUCATIONALCLASSES_SEARCH_FIELDS,
        EDUCATIONALCLASSES_LOOKUP_STAGES,
      );

    return {
      ...paginatedEducationalClasses,
      pageNumber: Math.ceil(
        paginatedEducationalClasses.totalItems / criteria.pageSize,
      ),
    };
  }

  /**
   * Find educationalClasses with specific id
   * @param id _id of educationalClasses
   * @returns educationalClasses corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<EducationalClasses | undefined> {
    return this.educationalClassesRepository.findById(id).populate([
      { path: 'cursus' },
      {
        path: 'courseSelection',
        populate: {
          path: 'courses',
        },
      },
    ]);
  }
  
  /**
   * Create a educationalClasses
   * @param createeducationalClassesDto educationalClasses to be created
   * @returns Created educationalClasses
   */
  async create(
    createeducationalClassesDto: CreateeducationalClassesDto,
  ): Promise<EducationalClasses> {
    return this.educationalClassesRepository.create(
      createeducationalClassesDto,
    );
  }

  /**
   * Update EducationalClasses with specific Id
   * @param id Id of EducationalClasses
   * @param updateeducationalClassesDto Partial of EducationalClasses containing the update
   * @returns Updated EducationalClasses
   */
  async update(
    id: string,
    updateeducationalClassesDto: UpdateeducationalClassesDto,
  ): Promise<EducationalClasses> {
    const updatedEducationalClasses =
      await this.educationalClassesRepository.update(
        id,
        updateeducationalClassesDto,
      );
    return updatedEducationalClasses;
  }

  /**
   * Update nbPermissions of EducationalClasses
   * @param EducationalClasses EducationalClasses to update
   */

  /**
   * Remove EducationalClasses with specific id
   * @param id Id of EducationalClasses
   * @returns true if deletion is successful
   */
  async remove(id: string): Promise<boolean> {
    return this.educationalClassesRepository.delete(id);
  }
}
