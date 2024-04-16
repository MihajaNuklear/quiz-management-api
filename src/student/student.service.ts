import { Injectable } from '@nestjs/common';
import { StudentRepository } from './student.repository';
import { CreateStudentDto } from './dto/create-student.dto';
import { RegistratedCourse, Result, Student } from './entities/student.entity';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { PaginatedStudents } from './paginated-students.interface';
import {
  STUDENTS_LOOKUP_STAGES,
  STUDENT_SEARCH_FIELDS,
} from './student.constant';
import { STUDENT_BASE_USERNAME } from '../count/count.constant';
import { CountRepository } from '../count/count.repository';
import { HistoryWithData } from './../history/dto/create-history-with-data';
import { HistoryService } from '../history/history.service';
import mongoose from 'mongoose';

@Injectable()
export class StudentService {
  /**
   * Constructor of studentService
   * @param studentRepository Injected Student Repository
   */
  constructor(
    private readonly studentRepository: StudentRepository,
    private readonly countRepository: CountRepository,
    private readonly historyService: HistoryService,
  ) {}

  /**
   * Create a Student
   * @param createStudentDto Student to be created
   * @returns Created Student
   */
  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    const createdStudent = this.studentRepository.create(createStudentDto);
    if (createdStudent) {
      let count = 1;
      const countQueue: any | null = await this.countRepository.findOne({});
      const lastCount = countQueue.countStudentValue;
      count = lastCount === 0 ? 1 : lastCount + 1;
      await this.countRepository.update(countQueue._id, {
        countStudentValue: count,
      });
      return createdStudent;
    }
    return null;
  }

  /**
   * Get list of all Students
   * @returns List of all Students
   */
  findAll(): Promise<Student[]> {
    return this.studentRepository.find({}).populate([
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
      {
        path: 'educationalClasses',
        populate: {
          path: 'cursus',
        },
      },
    ]);
  }

  /**
   * Get paginated Students based on list criteria
   * @param criteria Criteria used to filter Students
   * @returns Paginated Students, studentNames and studentDescriptions for filter
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedStudents> {
    const paginatedStudent = await this.studentRepository.getByListCriteria(
      criteria,
      STUDENT_SEARCH_FIELDS,
      STUDENTS_LOOKUP_STAGES,
      {
        'user.isDelete': false,
      },
    );

    return {
      ...paginatedStudent,
      pageNumber: Math.ceil(paginatedStudent.totalItems / criteria.pageSize),
    };
  }
  /**
   * Find Student with specific id
   * @param id _id of Student
   * @returns Student corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<Student | undefined> {
    return this.studentRepository.findById(id).populate([
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
      {
        path: 'educationalClasses',
        populate: {
          path: 'cursus',
        },
      },
      ,
      {
        path: 'educationalClasses',
        populate: {
          path: 'courseSelection',
          populate: {
            path: 'courses',
          },
        },
      },
      {
        path: 'registratedCourse',
        populate: {
          path: 'course',
          populate: {
            path: 'session',
          },
        },
      },
    ]);
  }

  /**
   * Find Student with specific id
   * @param id _id of Student
   * @returns Student corresponding to id, otherwise undefined
   */
  async findOneByUser(userId: string): Promise<Student | undefined> {
    return await this.studentRepository.findOne({ user: userId }).populate([
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
      {
        path: 'educationalClasses',
        populate: {
          path: 'cursus',
        },
      },
      ,
      {
        path: 'educationalClasses',
        populate: {
          path: 'courseSelection',
          populate: {
            path: 'courses',
          },
        },
      },
      {
        path: 'registratedCourse',
        populate: {
          path: 'course',
          populate: {
            path: 'session',
          },
        },
      },
    ]);
  }

/**
 * Find Student with specific course id
 * @param courseId _id of the course
 * @returns Student corresponding to the course id, otherwise undefined
 */
async getResultByCourseId(courseId: string): Promise<Student | undefined> {
  const student: any = await this.studentRepository.findOne({ "registratedCourse.course": courseId }).populate([
    { path: 'user' },
    {
      path: 'educationalClasses',
      populate: {
        path: 'cursus',
      },
    },
    {
      path: 'registratedCourse',
      populate: {
        path: 'course',
      },
    },
  ]);
  if (student) {
    const filteredCourses = student.registratedCourse.filter((course: any) => course.course._id == courseId);
    student.registratedCourse = filteredCourses;
    return student;
  }
  return undefined;
}



  /**
   * Get list of all Students
   * @returns List of all Students
   */
  getStudentByEducationalClassesId(educationalClassesId): Promise<Student[]> {
    return this.studentRepository
      .find({ educationalClasses: educationalClassesId })
      .populate([
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
        {
          path: 'educationalClasses',
          populate: {
            path: 'cursus',
          },
        },
      ]);
  }

  /**
   * Update Student with specific Id
   * @param id Id of Student
   * @param updateStudentDto Partial of Student containing the update
   * @returns Updated Student
   */
  async update(
    id: string,
    updateStudentDto: HistoryWithData,
  ): Promise<Student> {
    const { data, history } = updateStudentDto;

    const updatedStudent = await this.studentRepository.update(id, {
      ...data,
    });
    if (updatedStudent) {
      this.historyService.create(history);
    }

    return updatedStudent;
  }

  /**
   * Update Student Results with specific Id
   * @param id Id of Student
   * @param updateStudentDto Partial of Student containing the update
   * @returns Updated Student
   */
  async updateStudentResult(
    studentId: string,
    updateStudentResultsDto: HistoryWithData | any,
  ): Promise<Student | any> {
    const { data, history } = updateStudentResultsDto;
    const courseId = data.courseId;
    const average = data.average;
    const results: Result[] = data.resultsData;

    const studentData: Student = await this.studentRepository.findById(
      studentId,
    );
    const filterRegistrationCours = studentData.registratedCourse.filter(
      (item) => item.course != courseId,
    );
    const updatedCourse = {
      course: new mongoose.Types.ObjectId(courseId),
      average,
      result: results.map((res) => {
        return {
          examDate: res.examDate,
          note: res.note,
        };
      }),
    };
    const updatedRegistratedCourse = [
      ...filterRegistrationCours,
      updatedCourse,
    ];

    const updatedData = {
      _id: studentData._id,
      registrationNumber: studentData.registrationNumber,
      educationalClasses: studentData.educationalClasses,
      user: studentData.user,
      registratedCourse: updatedRegistratedCourse,
    };

    const updatedStudent = await this.studentRepository.update(
      studentId,
      updatedData,
    );

    if (updatedStudent) {
      this.historyService.create(history);
    }

    return updatedData;
  }

  /**
   * Remove Student with specific id
   * @param id Id of Student
   * @returns true if deletion is successful
   */
  async remove(id: string): Promise<boolean> {
    return this.studentRepository.delete(id);
  }

  /**
   * Generate Username Student
 
   * @returns Username Student with based name
   */
  async generatingUsernameStudent(): Promise<string> {
    let count = 1;
    const countQueue: any | null = await this.countRepository.findOne({});
    const lastCount = countQueue.countStudentValue;
    count = lastCount === 0 ? 1 : lastCount + 1;
    const newUsername = `${STUDENT_BASE_USERNAME}${count
      .toString()
      .padStart(4, '0')}`;
    await this.countRepository.update(countQueue._id, {
      countStudentValue: count,
    });
    return newUsername;
  }

  /**
   * Find All Role Count
   * @param res
   */
  async getEducationalClasseCount() {
    const result = await this.studentRepository
      .find({})
      .populate('educationalClasses')
      .exec();

    const groupedResult = result.map((classes: any) => ({
      name: classes.educationalClasses.name,
    }));

    const countMap = groupedResult.reduce((acc, curr) => {
      acc[curr.name] = (acc[curr.name] || 0) + 1;
      return acc;
    }, {});

    const items = Object.keys(countMap).map((name) => ({
      name,
      count: countMap[name],
    }));

    return { items, totalNumber: result.length };
  }
}
