import { Injectable } from '@nestjs/common';
import { TeacherRepository } from './teacher.repository';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedTeachers } from './paginated-teachers.interface';
import {
  TEACHERS_LOOKUP_STAGES,
  TEACHERS_SEARCH_FIELDS_WITH_MONGO_SEARCH,
  TEACHERS_SEARCH_INDEX,
  TEACHER_SEARCH_FIELDS,
} from './teacher.constant';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { CountRepository } from '../count/count.repository';

@Injectable()
export class TeacherService {
  getRequestSuggestions(search: string) {
    throw new Error('Method not implemented.');
  }
  /**
   * Constructor of teacherService
   * @param teacherRepository Injected Teacher Repository
   */
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly countRepository: CountRepository
    ) {}

  /**
   * Create a Teacher
   * @param createTeacherDto Teacher to be created
   * @returns Created Teacher
   */
  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    const createdTeacher =  this.teacherRepository.create(createTeacherDto);
    if(createdTeacher){
    let count = 1;
    const countQueue: any | null = await this.countRepository.findOne({});
    const lastCount = countQueue.countTeachertValue;
    count = lastCount === 0 ? 1 : lastCount + 1;
      await this.countRepository.update(countQueue._id, {
        countTeachertValue: count,
      });
    return createdTeacher;
    }
    return null;
  }

  /**
   * Get list of all Teachers
   * @returns List of all Teachers
   */
  findAll(): Promise<Teacher[]> {
    return this.teacherRepository.find({}).populate([
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

  /**
   * Get paginated Teachers based on list criteria
   * @param criteria Criteria used to filter Teachers
   * @returns Paginated Teachers, teacherNames and teacherDescriptions for filter
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedTeachers> {
    const paginatedTeachers = await this.teacherRepository.getByListCriteria(
      criteria,
      TEACHER_SEARCH_FIELDS,
      TEACHERS_LOOKUP_STAGES,
      {
        'user.isDelete': false,
      },
    );

    return {
      ...paginatedTeachers,
      pageNumber: Math.ceil(paginatedTeachers.totalItems / criteria.pageSize),
    };
  }
  /**
   * Find Teacher with specific id
   * @param id _id of Teacher
   * @returns Teacher corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Teacher | undefined> {
    return this.teacherRepository.findById(id).populate([
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

  async findOneByUser(userId: string): Promise<Teacher | undefined> {
    return await this.teacherRepository.findOne({ user: userId }).populate([
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
      }
    ]);
  }

  /**
   * Update Teacher with specific Id
   * @param id Id of Teacher
   * @param updateTeacherDto Partial of Teacher containing the update
   * @returns Updated Teacher
   */
  async update(
    id: string,
    updateTeacherDto: UpdateTeacherDto,
  ): Promise<Teacher> {
    const updatedTeacher = await this.teacherRepository.update(
      id,
      updateTeacherDto,
    );
    return updatedTeacher;
  }

  /**
   * Remove Teacher with specific id
   * @param id Id of Teacher
   * @returns true if deletion is successful
   */
  async remove(id: string): Promise<boolean> {
    return this.teacherRepository.delete(id);
  }
}
