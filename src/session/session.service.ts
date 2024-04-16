import { Injectable } from '@nestjs/common';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { SessionRepository } from './session.repository';
import { OccuppedClasses, PaginatedSession } from './paginated-session.interface';
import {
  SESSIONS_SEARCH_FIELDS_WITH_MONGO_SEARCH,
  SESSION_LOOKUP_STAGES,
} from './session.constant';
import { Session } from './entities/session.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { EducationalClassesRepository } from './../educational-classes/educational-classes.repository';
import { HistoryService } from '../history/history.service';
import { CreateHistoryDto } from '../history/dto/create-history.dto';
@Injectable()
@Injectable()
export class SessionService {
  /**
   * Constructor of SessionService
   * @param SessionRepository Injected Session Repository
   * @param userService Injected User Service
   */
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly historyService: HistoryService,
    private readonly educationalClassesRepository: EducationalClassesRepository
  ) {}

  /**
   * Get paginated Sessions based on list criteria
   * @param criteria Criteria used to filter Sessions
   * @returns Paginated Sessions, SessionNames and SessionDescriptions for filter
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedSession> {
    const paginatedSessions = await this.sessionRepository.getByListCriteria(
      criteria as ListCriteria,
      SESSIONS_SEARCH_FIELDS_WITH_MONGO_SEARCH,
      SESSION_LOOKUP_STAGES,
      {
        'teacher.user.isDelete': false,
      },
    );

    return {
      ...paginatedSessions,
      pageNumber: Math.ceil(paginatedSessions.totalItems / criteria.pageSize),
    };
  }

  /**
   * Get list of all Sessions
   * @returns List of all Sessions
   */
  findAll(): Promise<Session[]> {
    return this.sessionRepository.find({});
  }

  /**
   * Find Session with specific id
   * @param id _id of Session
   * @returns Session corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Session | undefined> {
    return this.sessionRepository.findById(id).populate([
      {
        path: 'educationalClasses',
        populate: {
          path: 'cursus',
        },
      },
    ]);
  }
  
  /**
   * Find Session with class id
   * @param id _id of Session
   * @returns Session corresponding to id, otherwise undefined
   */
  async findSessionByClassId(classId: string): Promise<Session[] | undefined> {
    return this.sessionRepository.find({
      occupiedClasses: { $elemMatch: { $eq: classId } }
    }).populate(
      {
        path: 'occupiedClasses',
      },
    );
  }


    /**
   * Get all Occuped class and his sessions
   * @param id sourse Id
   * @returns Occuped class and sessions
   */
    async getOccupedClass(
      courseId: string,
    ): Promise<OccuppedClasses> {
      const classes = await this.educationalClassesRepository.find({ flattedCourseSelection: {$in: [courseId]}}); 
      const sessionsData = await this.sessionRepository.find({occupiedClasses: { $in: classes.map((it: any) => it._id)}}).populate({ path: 'occupiedClasses' },)
      const response: OccuppedClasses = {
        classes: classes,
        sessions: sessionsData
      } 
      return response;
    }


    /**
   * Find Session with class id
   * @param id _id of Session
   * @returns Session corresponding to id, otherwise undefined
   */
    async findSessionByClassesId(classesId: string[]): Promise<Session[] | undefined> {
      return await this.sessionRepository.find({occupiedClasses: { $in: classesId}})
    }

  

  /**
   * Create a Session
   * @param createSessionDto Session to be created
   * @returns Created Session
   */
  async create(createSessionDto: CreateSessionDto): Promise<Session> {
    return this.sessionRepository.create(createSessionDto);
  }

  /**
   * Update Session with specific Id
   * @param id Id of Session
   * @param updateSessionDto Partial of Session containing the update
   * @returns Updated Session
   */
  async update(
    id: string,
    updateSessionDto: UpdateSessionDto,
  ): Promise<Session> {
    const updatedSession = await this.sessionRepository.update(
      id,
      updateSessionDto,
    );
    return updatedSession;
  }

  /**
   * Update nbPermissions of Session
   * @param Session Session to update
   */

  /**
   * Remove Session with specific id
   * @param id Id of Session
   * @returns true if deletion is successful
   */
  async remove(id: string,history: any): Promise<boolean> {
    const deletedSession =  this.sessionRepository.delete(id);
    if (deletedSession) {
      this.historyService.create(history.historyData);      
    } else {
      return null;
    }
    return null;
  }
}