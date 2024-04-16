import { Injectable } from '@nestjs/common';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { ApplicationRepository } from './application.repository';
import { TasksDetailsDto } from './dto/tasksDetails.dto';
import { ApplicationStatus } from './entities/application.entity';
import { TasksStatusDto } from './dto/tasksStatus.dto';
import { MailQueueService } from '../mail-queue/mail-queue.service';
import conf from '../config/configuration.constant';
import { MailQueueStatus } from '../mail-queue/entities/mail-queue.entity';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { STUDENT_ROLE } from '../db-script/db-script.constants';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedApplication } from './paginated-application.interface';
import {
  APPLICATIONS_LOOKUP_STAGES,
  APPLICATION_SEARCH_FIELDS,
} from './application.constants';
import { CountRepository } from '../count/count.repository';
import { CANDIDATE_BASE_USERNAME } from '../count/count.constant';
import { HistoryService } from '../history/history.service';
import { ActionName } from '../history/entity/history.entity';
import { StudentService } from '../student/student.service';
import { HistoryWithData } from '../history/dto/create-history-with-data';
import { Student } from '../student/entities/student.entity';
import { RoleRepository } from '../role/role.repository';
import { Role } from '../role/entities/role.entity';
import { EducationalClassesService } from '../educational-classes/educational-classes.service';
@Injectable()
export class ApplicationService {
  constructor(
    private readonly ApplicationRepository: ApplicationRepository,
    private readonly countRepository: CountRepository,
    private readonly mailQueuService: MailQueueService,
    private readonly userService: UserService,
    private readonly roleRepository: RoleRepository,
    private readonly historyService: HistoryService,
    private readonly educationalClassesService: EducationalClassesService,
    private readonly studentService: StudentService,
  ) {}

  public async createCandidate(createCandidateDto: any) {
    const {
      firstname,
      lastname,
      username,
      address,
      email,
      phone,
      gender,
      birthPlace,
      birthDate,
      diploma,
      motivation,
      certification,
    } = createCandidateDto;

    const userInfo: User = {
      firstname,
      lastname,
      username: await this.generatingUsername(),
      address,
      email,
      phone,
      gender,
      birthDate,
      birthPlace,
      photo: 'defaultPdp.jpg',
      groups: [],
      roles: [],
      creationDate: undefined,
      filters: [],
      isActive: true,
      isDelete: false,
    };

    const user: User = await this.userService.createUserCandidate(userInfo);

    const userId = user._id;

    const applicationInfo = {
      user: userId,
      diploma,
      motivation,
      certification,
    };

    const applicationData: any = {
      ...applicationInfo,
      applicationStatus: ApplicationStatus.UNREAD,
      competitionResult: {
        totalTasksNumber: 0,
        finishedTasksNumber: 0,
        TaskDetails: [],
      },
    };

    const result = await this.ApplicationRepository.create(applicationData);
    const countQueue: any | null = await this.countRepository.findOne({});
    const lastCountCandidate = countQueue.countCandidateValue;

    if (!result) {
      await this.userService.remove(userId.toString());
      return result;
    } else {
      const userEmail = user.email;

      const mailOption = {
        to: userEmail,
        from: conf().mail.smtpUser,
        subject: 'CONFIRMATION',
        status: MailQueueStatus.NOT_SENT,
        sendAttemptCount: 0,
      };
      await this.mailQueuService.create(mailOption);
      return result;
    }
  }

  /**
   * Generate Username Candidate
 
   * @returns Username Candidate with based name
   */
  async generatingUsername(): Promise<string> {
    let count = 1;
    const countQueue: any | null = await this.countRepository.findOne({});
    const lastCount = countQueue.countCandidateValue;
    count = lastCount === 0 ? 1 : lastCount + 1;
    const newUsername = `${CANDIDATE_BASE_USERNAME}${count
      .toString()
      .padStart(4, '0')}`;

    await this.countRepository.update(countQueue._id, {
      countCandidateValue: count,
    });
    return newUsername;
  }

  async findAll() {
    const result = await this.ApplicationRepository.find({}).populate('user');
    return result;
  }

  /**
   * Find All Application
   * @param res
   */
  async getCount() {
    const result = await this.ApplicationRepository.find({}).exec();
    const groupedResult = result.reduce((acc, doc) => {
      const status = doc.applicationStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return { ...groupedResult, totalNumber: result.length };
  }

  /**
   * Find All Application
   * @param res
   */
  async getStatusCount() {
    const result = await this.ApplicationRepository.find({}).exec();
    const groupedResult = result.reduce((acc, doc) => {
      const status = doc.applicationStatus;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    const items = Object.keys(groupedResult).map((name) => ({
      name,
      count: groupedResult[name],
    }));

    return { items, totalNumber: result.length };
  }

  /**
   * Get paginated application , based on list criteria
   * @param criteria criteria used to find Users
   * @returns Paginated Users
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedApplication> {
    const paginatedApplication =
      await this.ApplicationRepository.getByListCriteria(
        criteria as ListCriteria,
        APPLICATION_SEARCH_FIELDS,
        APPLICATIONS_LOOKUP_STAGES,
        {
          'user.isDelete': false,
        },
      );

    return {
      ...paginatedApplication,
      pageNumber: Math.ceil(
        paginatedApplication.totalItems / criteria.pageSize,
      ),
    };
  }

  async findOne(id: string) {
    const result = await this.ApplicationRepository.findById(id).populate([
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
    return result;
  }

  async findByUserId(userId: string) {
    const result = await this.ApplicationRepository.findOne({ user: userId });
    return result;
  }

  async update(id: string, updateApplicationDto: UpdateApplicationDto | any) {
    const result = await this.ApplicationRepository.update(
      id,
      updateApplicationDto,
    );
    return result;
  }

  async updateStatus(
    applicationId: string,
    updateApplication: HistoryWithData,
  ) {
    const { data, history } = updateApplication;

    const { applicationStatus } = data;

    const { user, targetId } = history;

    if (updateApplication.data.educationalClasse) {
      const userHistory = {
        action: { name: ActionName.UPDATE_USER },
        user: user,
        entity: 'User',
      };
      await this.updateUserByStatus(
        targetId,
        updateApplication.data.educationalClasse,
        userHistory,
      );
    } else {
      const updtatedApplication = await this.ApplicationRepository.update(
        applicationId,
        { applicationStatus: applicationStatus },
      );
      if (updtatedApplication) {
        const result = await this.historyService.create(history);
        return result;
      }
    }
    return null;
  }

  async updateUserByStatus(
    applicationId: string,
    educationClasseId: string,
    userHistory: any,
  ) {
    const application = await this.ApplicationRepository.findById(
      applicationId,
    ).populate([{ path: 'user' }]);

    const studentRole: Role = await this.roleRepository.findOne({
      name: STUDENT_ROLE,
    });

    const user: User = application.user as unknown as User;

    const history = { targetId: user._id, ...userHistory };

    const newUsername = await this.studentService.generatingUsernameStudent();

    const userData = {
      username: newUsername,
      roles: [studentRole._id],
    };

    const payload = { data: userData, history };
    const isUpdatedToStudent = await this.userService.update(
      user._id.toString(),
      payload,
    );

    const educationalClasse = await this.educationalClassesService.findOne(
      educationClasseId,
    );

    const cursusAlias = educationalClasse.name.split(' ')[1];

    const obligatoryCourses = educationalClasse.courseSelection.filter(
      (course) => course.courses.length === 1,
    );

    const obligatoryCourseIds = obligatoryCourses.map(
      (course) => course.courses[0]._id,
    );

    const registratedCourses = obligatoryCourseIds.map((courseId) => ({
      course: courseId,
      result: [],
    }));

    const now = new Date();

    const usernameNumber = newUsername.split('-')[1];

    if (isUpdatedToStudent) {
      const newStudent: Student = {
        registrationNumber: `${usernameNumber}-${cursusAlias}-${now.getFullYear()}`,
        user: user._id.toString(),
        educationalClasses: educationClasseId,
        registratedCourse: [],
        // registratedCourse: registratedCourses,
      };
      await this.studentService.create(newStudent);
    }
  }

  async updateTaskDetails(id: string, taskDetailsDto: TasksDetailsDto) {
    const application = await this.ApplicationRepository.findById(id).populate(
      'competitionResult',
    );

    const competitionResult = application.competitionResult;

    competitionResult.TaskDetails.push(taskDetailsDto);

    competitionResult.totalTasksNumber++;

    application.competitionResult = competitionResult;

    const updatedApplication = await application.save();

    return updatedApplication;
  }

  async updateTaskStatus(id: string, taskUpdate: TasksStatusDto | any) {
    const application = await this.ApplicationRepository.findById(id).populate(
      'competitionResult',
    );
    const competitionResult = application.competitionResult;

    const taskIdToUpdate = taskUpdate.taskId;

    const taskToUpdate = competitionResult.TaskDetails.find((task) => {
      return task._id.toString() === taskIdToUpdate;
    });

    if (taskToUpdate) {
      taskToUpdate.status = taskUpdate.status;

      if (taskUpdate.status === 'FINISHED') {
        competitionResult.finishedTasksNumber++;
      }

      const updatedApplication = await application.save();

      return updatedApplication;
    } else {
      throw new Error('Tâche non trouvée');
    }
  }

  async UpdateApplication(id: string, updatedDto: UpdateApplicationDto) {
    const { user, ...application }: { user: User } = updatedDto;

    const updatedUser = await this.userService.update(
      user._id.toString(),
      updatedDto.user,
    );

    if (updatedUser && application) {
      const updateApplication = await this.update(id, application);
      if (updateApplication) {
        console.log('MODIFICATION AVEC SUCCESS');
        console.log(updateApplication);
        return updateApplication;
      }
    } else {
      throw new Error('Erreur sur la modification des données');
    }
  }

  async remove(id: string) {
    const result = await this.ApplicationRepository.delete(id);
    console.log(result);

    // if (result) {
    //   await this.userService.update(userId, {
    //     isActive: false,
    //     isDelete: true,
    //   });
    // }

    return result;
  }
}
