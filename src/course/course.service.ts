import { Injectable } from '@nestjs/common';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { CreateCourseDto } from './dto/create-course.dto';
import { Course } from './entities/course.entity';
import { PaginatedCourse } from './paginated-courses.interface';
import { COURSE_LOOKUP_STAGES, COURSE_SEARCH_FIELDS } from './course.constants';
import { CourseRepository } from './course.repository';
import { HistoryService } from '../history/history.service';
import { TeacherService } from '../teacher/teacher.service';

/**
 * Service for Course layer
 */
@Injectable()
export class CourseService {
  /**
   * Constructor of CourseService
   * @param CourseRepository Injected Course Repository
   * @param teacherService Injected User Service
   */
  constructor(
    private readonly courseRepository: CourseRepository,
    private readonly teacherService: TeacherService,
    private readonly historyService: HistoryService,
  ) {}

  /**
   * Get paginated Courses based on list criteria
   * @param criteria Criteria used to filter Courses
   * @returns Paginated Courses, CourseNames and CourseDescriptions for filter
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedCourse> {
    const paginatedCourses = await this.courseRepository.getByListCriteria(
      criteria as ListCriteria,
      COURSE_SEARCH_FIELDS,
      COURSE_LOOKUP_STAGES,
      {
        'teacher.user.isDelete': false,
      },
    );

    return {
      ...paginatedCourses,
      pageNumber: Math.ceil(paginatedCourses.totalItems / criteria.pageSize),
    };
  }

  /**
   * Get list of all Courses
   * @returns List of all Courses
   */
  findAll(): Promise<Course[]> {
    return this.courseRepository.find({});
  }

  /**
   * Get list of all Courses
   * @returns List of all Courses
   */
  async findTeacherCourseByUserId(userIid: string): Promise<Course[]> {
    const teacher = await this.teacherService.findOneByUser(userIid);
    return this.courseRepository.find({ teacher: teacher._id }).populate([
      { path: 'teacher' },
      {
        path: 'teacher',
        populate: {
          path: 'user',
        },
      },
      {
        path: 'session',
        populate: {
          path: 'occupiedClasses',
        },
      },
    ]);
  }
  /**
   * Find Course with specific id
   * @param id _id of Course
   * @returns Course corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Course | undefined> {
    return this.courseRepository.findById(id).populate([
      { path: 'teacher' },
      {
        path: 'teacher',
        populate: {
          path: 'user',
        },
      },
      {
        path: 'session',
        populate: {
          path: 'occupiedClasses',
        },
      },
    ]);
  }

  /**
   * Create a Course
   * @param createCourseDto Course to be created
   * @returns Created Course
   */
  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    return this.courseRepository.create(createCourseDto);
  }

  /**
   * Update Course with specific Id
   * @param id Id of Course
   * @param updateCourseDto Partial of Course containing the update
   * @returns Updated Course
   */
  async update(id: string, updateCourseDto: any): Promise<Course> {
    const { course, history } = updateCourseDto;

    const updatedCourse = await this.courseRepository.update(id, course);
    if (updatedCourse) {
      this.historyService.create(history);
    } else {
      return null;
    }
    return updatedCourse;
  }

  /**
   * Add session with specific Id
   * @param id Id of Course
   * @param updateCourseDto Partial of Course containing the update
   * @returns Updated Course
   */
  async addSession(id: string, updateCourseDto: any): Promise<Course> {
    const courseFromDb = await this.courseRepository.findById(id);
    const updatingValue = {
      session: [
        ...courseFromDb.session,
        {
          ...updateCourseDto,
          pointing: [],
        },
      ],
    };
    const updatedCourse = await this.courseRepository.update(id, updatingValue);
    return updatedCourse;
  }

  /**
   * Update nbPermissions of Course
   * @param Course Course to update
   */

  /**
   * Remove Course with specific id
   * @param id Id of Course
   * @returns true if deletion is successful
   */
  async remove(id: string): Promise<boolean> {
    return this.courseRepository.delete(id);
  }

  /**
   * Find Course with session id
   * @param id _id of Course
   * @returns Course corresponding to id, otherwise undefined
   */
  async findCourseBySessionId(SessionId: string): Promise<Course | undefined> {
    return this.courseRepository
      .findOne({
        session: SessionId,
      })
      .populate([
        { path: 'teacher' },
        {
          path: 'teacher',
          populate: {
            path: 'user',
          },
        },
        {
          path: 'session',
          populate: {
            path: 'occupiedClasses',
          },
        },
      ]);
  }
}
