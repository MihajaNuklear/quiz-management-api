import {
  Privilege,
  PrivilegeName,
} from '../../privilege/entities/privilege.entity';
import configuration from '../../config/configuration.constant';
import { Role } from '../../role/entities/role.entity';
import { RoleRepository } from '../../role/role.repository';
import { GENDER, User } from '../../user/entities/user.entity';
import { USER_DEFAULT_FILTERS } from '../../user/user.constants';
import { UserRepository } from '../../user/user.repository';
import { DbScriptService } from '../db-script.service';
import { ScriptFn } from '../dto/script-fn.interface';
import { PrivilegeRepository } from '../../privilege/permission.repository';
import { Group } from '../../group/entities/group.entity';
import { GroupRepository } from '../../group/group.repository';
import * as faker from 'faker';

import {
  ADMIN_1_ROLE,
  ADMIN_1_ROLE_ALIAS,
  ADMIN_GROUP,
  ADMIN_GROUP_ALIAS,
  CANDIDATE_ROLE,
  CANDIDATE_ROLE_ALIAS,
  CURSUS_INITIAL,
  GUEST_GROUP,
  GUEST_GROUP_ALIAS,
  GUEST_ROLE,
  GUEST_ROLE_ALIAS,
  STUDENT_GROUP,
  STUDENT_GROUP_ALIAS,
  STUDENT_ROLE,
  STUDENT_ROLE_ALIAS,
  SUPER_ADMIN_ROLE,
  SUPER_ADMIN_ROLE_ALIAS,
  TEACHER_GROUP,
  TEACHER_GROUP_ALIAS,
  TEACHER_ROLE,
  TEACHER_ROLE_ALIAS,
  TECH_GROUP,
  TECH_GROUP_ALIAS,
  TECH_ROLE,
  TECH_ROLE_ALIAS,
  privilegeWithItsGroup,
} from '../db-script.constants';
import { Cursus } from '../../cursus/entities/cursus.entity';
import { CursusRepository } from '../../cursus/cursus.repository';
import { StudentRepository } from '../../student/student.repository';
import {
  RegistratedCourse,
  Student,
} from '../../student/entities/student.entity';
import { Course, SemesterType } from '../../course/entities/course.entity';
import { CourseRepository } from '../../course/course.repository';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { TeacherRepository } from '../../teacher/teacher.repository';
import getRandomGender from '../../shared/utils/random.gender';
import { EducationalClasses } from '../../educational-classes/entities/educational-classes.entity';
import { EducationalClassesRepository } from '../../educational-classes/educational-classes.repository';

import { Count } from '../../count/entities/count.entity';
import { CountRepository } from '../../count/count.repository';
import {
  CANDIDATE_BASE_USERNAME,
  STUDENT_BASE_USERNAME,
  TEACHER_BASE_USERNAME,
} from '../../count/count.constant';
import {
  Application,
  ApplicationStatus,
} from '../../application/entities/application.entity';
import { ApplicationRepository } from '../../application/application.repository';
import { EventType, SchoolEvent } from '../../events/entities/event.entity';
import { EventRepository } from './../../events/events.repository';
import { SessionRepository } from '../../session/session.repository';
import { Session } from '../../session/entities/session.entity';
import { RegistrationPeriod } from '../../registration-period/entities/registration-period.entity';
import { RegistrationPeriodRepository } from '../../registration-period/registration-period.repository';
import { group } from 'console';

const teacherPassword = 'admin';

const candidatePassword = 'pass';

const studentPassword = 'pass';

const administrationToGenerate = 5;

const candidateToGenerate = 200;

const studentToGenerate = 500;

const teacherToGenerate = 20;

const phonePrefixes = [
  '032',
  '033',
  '034',
  '038',
  '+26132',
  '+26133',
  '+26134',
  '+26138',
];

const dropDB01: ScriptFn = async (dbScriptService: DbScriptService) => {
  await dbScriptService.dropDB();
};

/**
 * Create Super Admin User with username and password from configuration (.env)
 * @param dbScriptService DbScriptService instance
 */
const createGroups: ScriptFn = async (dbScriptService: DbScriptService) => {
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const groups = [
    {
      name: ADMIN_GROUP,
      alias: ADMIN_GROUP_ALIAS,
      description: "Un nouveau groupe pour l'Administration",
    },
    {
      name: STUDENT_GROUP,
      alias: STUDENT_GROUP_ALIAS,
      description: 'Un nouveau groupe pour les étudiants',
    },
    {
      name: TEACHER_GROUP,
      alias: TEACHER_GROUP_ALIAS,
      description: 'Un nouveau groupe pour les enseignants',
    },
    {
      name: TECH_GROUP,
      alias: TECH_GROUP_ALIAS,
      description: 'Un nouveau groupe pour les equipe technique',
    },
    {
      name: GUEST_GROUP,
      alias: GUEST_GROUP_ALIAS,
      description: 'Un nouveau groupe pour les visiteurs',
    },
  ];
  for (let group of groups) {
    await groupRepository.create({ ...group });
  }
};

const createRegistrationPeriod: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const registrationPeriodRepository = (await dbScriptService.getRepository(
    RegistrationPeriod,
  )) as RegistrationPeriodRepository;
  const periods = {
    startDate: new Date('2023-12-01'),
    endDate: new Date('2024-02-28'),
    isOpen: false,
  };
  await registrationPeriodRepository.create(periods);
};

/**
 * Create init cursus
 * @param dbScriptService
 */
const createTeacher: ScriptFn = async (DbScriptService: DbScriptService) => {
  const userRepository = (await DbScriptService.getRepository(
    User,
  )) as UserRepository;

  const teacherRepository = (await DbScriptService.getRepository(
    Teacher,
  )) as TeacherRepository;

  const groupRepository = (await DbScriptService.getRepository(
    Group,
  )) as GroupRepository;

  const roleRepository = (await DbScriptService.getRepository(
    Role,
  )) as RoleRepository;

  const countRepository = (await DbScriptService.getRepository(
    Count,
  )) as CountRepository;

  const teacherGroup: Group = await groupRepository.findOne({
    name: TEACHER_GROUP,
  });

  const teacherRole: any = await roleRepository
    .findOne({ name: TEACHER_ROLE })
    .populate('privileges');

  const users: any = Array.from(
    new Array(teacherToGenerate),
    (_, index): any => {
      const newUsername: string = `${TEACHER_BASE_USERNAME}${(index + 1)
        .toString()
        .padStart(4, '0')}`;

      const number = faker.random.arrayElement([1, 2]);
      let phoneNumber;

      if (number === 1) {
        phoneNumber = [
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
        ];
      } else {
        phoneNumber = [
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
        ];
      }
      const user = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phone: phoneNumber,
        password: teacherPassword,
        email: faker.internet.email().toLocaleLowerCase(),
        creationDate: new Date(),
        roles: [teacherRole._id.toString()],
        username: newUsername,
        filters: USER_DEFAULT_FILTERS,
        address: `${faker.address.streetName()}&&${faker.address.zipCode()}&&${faker.address.city()}`,
        birthDate: faker.date.between('1995-01-01', '2008-12-31'),
        birthPlace: faker.address.city(),
        gender: getRandomGender(),
        groups: [teacherGroup._id.toString()],
        photo: 'teacher-female-default-pdp.jpg',
        failedConnectionCount: 0,
        isActive: true,
        isDelete: false,
        createdAt: faker.date.between('2023-01-01', '2024-02-01'),
        updatedAt: faker.date.between('2023-01-01', '2024-02-01'),
      };
      return user;
    },
  );
  const usersTab: User[] = [];

  for (let item of users) {
    usersTab.push(await userRepository.create(item));
  }

  for (let item of usersTab) {
    teacherRepository.create({
      user: item._id.toString(),
      timeWork: Math.floor(Math.random() * 200),
    });
  }

  const countQueue: any | null = await countRepository.findOne({});
  await countRepository.update(countQueue._id, {
    countTeachertValue: teacherToGenerate,
  });
};

/**
 * Create init EducationnalClasses
 * @param dbScriptService
 */
const createEducationalClasses: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const courseRepository = (await dbScriptService.getRepository(
    Course,
  )) as CourseRepository;

  const cursusRepository = (await dbScriptService.getRepository(
    Cursus,
  )) as CursusRepository;

  const educationalClassesRepository = (await dbScriptService.getRepository(
    EducationalClasses,
  )) as EducationalClassesRepository;

  const cursusTab: Cursus[] = await cursusRepository.find({});

  const educationalClassesTab: any[] = [
    {
      name: 'L1 GL',
      cursus: cursusTab[0]._id.toString(),
      schoolYear: '2022-2023',
      flattedCourseSelection: [],
      courseSelection: [],
    },
    {
      name: 'L2 GL',
      cursus: cursusTab[0]._id.toString(),
      schoolYear: '2022-2023',
      flattedCourseSelection: [],
      courseSelection: [],
    },
    {
      name: 'L3 GL',
      cursus: cursusTab[0]._id.toString(),
      schoolYear: '2022-2023',
      flattedCourseSelection: [],
      courseSelection: [],
    },
    {
      name: 'L1 ASR',
      cursus: cursusTab[1]._id.toString(),
      schoolYear: '2022-2023',
      flattedCourseSelection: [],
      courseSelection: [],
    },
    {
      name: 'L2 ASR',
      cursus: cursusTab[1]._id.toString(),
      schoolYear: '2022-2023',
      flattedCourseSelection: [],
      courseSelection: [],
    },
    {
      name: 'L3 ASR',
      cursus: cursusTab[1]._id.toString(),
      schoolYear: '2022-2023',
      flattedCourseSelection: [],
      courseSelection: [],
    },
  ];

  //
  for (let item of educationalClassesTab) {
    await educationalClassesRepository.create(item);
  }
};

/**
 * Create init Session of all course
 * @param dbScriptService
 */
const createCourseSession: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const sessionRepository = (await dbScriptService.getRepository(
    Session,
  )) as SessionRepository;

  const educationalClassesRepository = (await dbScriptService.getRepository(
    EducationalClasses,
  )) as EducationalClassesRepository;

  const classes: EducationalClasses[] = await educationalClassesRepository.find(
    {},
  );

  const SESSION_INITIAL = [
    //HTML
    {
      date: new Date('2024-04-27'),
      start: '08:00',
      end: '10:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[0]._id.toString()],
    },
    {
      date: new Date('2024-05-10'),
      start: '13:00',
      end: '15:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[0]._id.toString()],
    },
    {
      date: new Date('2024-04-15'),
      start: '08:00',
      end: '10:00',
      isExam: true,
      pointing: [],
      occupiedClasses: [classes[0]._id.toString()],
    },

    // ALGO INITIATION
    {
      date: new Date('2024-04-26'),
      start: '10:00',
      end: '12:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[0]._id.toString(), classes[3]._id.toString()],
    },
    {
      date: new Date('2024-04-18'),
      start: '13:00',
      end: '15:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[0]._id.toString()],
    },
    {
      date: new Date('2024-04-22'),
      start: '08:00',
      end: '12:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[3]._id.toString()],
    },
    {
      date: new Date('2024-04-19'),
      start: '08:00',
      end: '10:00',
      isExam: true,
      pointing: [],
      occupiedClasses: [classes[0]._id.toString(), classes[3]._id.toString()],
    },

    // /PYTHON BASE

    {
      date: new Date('2024-04-26'),
      start: '10:00',
      end: '12:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[1]._id.toString(), classes[4]._id.toString()],
    },

    // Introduction aux systèmes
    {
      date: new Date('2024-04-26'),
      start: '10:00',
      end: '12:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[3]._id.toString()],
    },

    // ReactJs
    {
      date: new Date('2024-04-28'),
      start: '08:00',
      end: '10:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[2]._id.toString()],
    },

    // Angular
    {
      date: new Date('2024-04-28'),
      start: '10:00',
      end: '12:00',
      isExam: false,
      pointing: [],
      occupiedClasses: [classes[2]._id.toString()],
    },
  ];

  for (let item of SESSION_INITIAL) {
    await sessionRepository.create(item);
  }
};

/**
 * Create init courses
 * @param dbScriptService
 */
const createCourses: ScriptFn = async (dbScriptService: DbScriptService) => {
  const courseRepository = (await dbScriptService.getRepository(
    Course,
  )) as CourseRepository;

  const teacherRepository = (await dbScriptService.getRepository(
    Teacher,
  )) as TeacherRepository;

  const teacherTab: Teacher[] = await teacherRepository.find({});

  const sessionRepository = (await dbScriptService.getRepository(
    Session,
  )) as SessionRepository;

  const sessions: Session[] = await sessionRepository.find({});

  const educationalClassesRepository = (await dbScriptService.getRepository(
    EducationalClasses,
  )) as EducationalClassesRepository;

  const COURSES_INITIAL = [
    {
      name: 'HTML5 Initiation', // GL1
      code: 'HTML5-001',
      semester: SemesterType.SEMESTER_1,
      session: [
        sessions[0]._id.toString(),
        sessions[1]._id.toString(),
        sessions[2]._id.toString(),
      ],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Algorithme Initiation', // GL1 ASR1
      code: 'ALGO-001',
      semester: SemesterType.SEMESTER_1,
      session: [
        sessions[3]._id.toString(),
        sessions[4]._id.toString(),
        sessions[5]._id.toString(),
        sessions[6]._id.toString(),
      ],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Python Base', // GL2 ASR2
      code: 'Python-002',
      semester: SemesterType.SEMESTER_2,
      session: [sessions[7]._id.toString()],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Java POO', // GL2 ASR2
      code: 'JAVA-002',
      semester: SemesterType.SEMESTER_2,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Intelligence Artificiel', // GL3 ASR3
      code: 'IA-003',
      semester: SemesterType.SEMESTER_6,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'PHP Framework (Symfony)', // GL2
      code: 'PHP-004',
      semester: SemesterType.SEMESTER_4,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Algèbre Linéaire', // GL1 ASR1
      code: 'Math-001',
      semester: SemesterType.SEMESTER_4,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },

    {
      name: 'Statistique', // GL2 ASR1
      code: 'Math-002',
      semester: SemesterType.SEMESTER_4,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'ReactJs', // GL3
      code: 'WEB-001',
      semester: SemesterType.SEMESTER_8,
      session: [sessions[9]._id.toString()],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Angular', // GL3
      code: 'WEB-002',
      semester: SemesterType.SEMESTER_8,
      session: [sessions[10]._id.toString()],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Français 1', // GL1 ASR1
      code: 'FR-001',
      semester: SemesterType.SEMESTER_1,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Français 2', // GL2 ASR2
      code: 'FR-002',
      semester: SemesterType.SEMESTER_1,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Français 3', // GL3 ASR2
      code: 'FR-003',
      semester: SemesterType.SEMESTER_3,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Anglais 1', // GL1 ASR1
      code: 'ANG-001',
      semester: SemesterType.SEMESTER_1,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Anglais 2', // GL2 ASR2
      code: 'ANG-002',
      semester: SemesterType.SEMESTER_2,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Anglais 3', // GL3 ASR2
      code: 'ANG-003',
      semester: SemesterType.SEMESTER_3,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: "Introduction aux systèmes d'exploitation", // ASR1
      code: 'ISE-001',
      semester: SemesterType.SEMESTER_1,
      session: [sessions[8]._id.toString()],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Sécurité informatique', //ASR2
      code: 'SECI-001',
      semester: SemesterType.SEMESTER_2,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Linux', // GL3 ASR3
      code: 'OSL-001',
      semester: SemesterType.SEMESTER_5,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
    {
      name: 'Cloud Computing', // ASR3
      code: 'CC-001',
      semester: SemesterType.SEMESTER_6,
      session: [],
      teacher:
        teacherTab[
          Math.floor(Math.random() * teacherTab.length)
        ]._id.toString(),
    },
  ];

  for (let item of COURSES_INITIAL) {
    await courseRepository.create(item);
  }
};

const updateEducationalClasses: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const courseRepository = (await dbScriptService.getRepository(
    Course,
  )) as CourseRepository;

  const courseTab: Course[] = await courseRepository.find({});

  const educationalClassesRepository = (await dbScriptService.getRepository(
    EducationalClasses,
  )) as EducationalClassesRepository;

  const educationalClasses: EducationalClasses[] =
    await educationalClassesRepository.find({});

  await educationalClassesRepository.update(
    educationalClasses[0]._id.toString(),
    {
      flattedCourseSelection: [
        courseTab[0]._id.toString(),
        courseTab[1]._id.toString(),
        courseTab[6]._id.toString(),
        courseTab[10]._id.toString(),
        courseTab[13]._id.toString(),
      ],
      courseSelection: [
        {
          label: 'Web base',
          credit: 2,
          courses: [courseTab[0]._id.toString()],
        },
        {
          label: 'Algorithme',
          credit: 3,
          courses: [courseTab[1]._id.toString()],
        },
        {
          label: 'Mathématique 1',
          credit: 4,
          courses: [courseTab[6]._id.toString()],
        },
        {
          label: 'Langue 1',
          credit: 1,
          courses: [courseTab[10]._id.toString(), courseTab[13]._id.toString()],
        },
      ],
    },
  );
  await educationalClassesRepository.update(
    educationalClasses[1]._id.toString(),
    {
      flattedCourseSelection: [
        courseTab[2]._id.toString(),
        courseTab[3]._id.toString(),
        courseTab[5]._id.toString(),
        courseTab[7]._id.toString(),
        courseTab[11]._id.toString(),
        courseTab[14]._id.toString(),
      ],
      courseSelection: [
        {
          label: 'Web Avancé',
          credit: 2,
          courses: [courseTab[5]._id.toString()],
        },
        {
          label: 'Python base',
          credit: 2,
          courses: [courseTab[2]._id.toString()],
        },
        {
          label: 'Java Base',
          credit: 2,
          courses: [courseTab[3]._id.toString()],
        },
        {
          label: 'Mathématique 2',
          credit: 3,
          courses: [courseTab[7]._id.toString()],
        },
        {
          label: 'Langue 2',
          credit: 1,
          courses: [courseTab[11]._id.toString(), courseTab[14]._id.toString()],
        },
      ],
    },
  );

  await educationalClassesRepository.update(
    educationalClasses[2]._id.toString(),
    {
      flattedCourseSelection: [
        courseTab[8]._id.toString(),
        courseTab[9]._id.toString(),
        courseTab[4]._id.toString(),
        courseTab[18]._id.toString(),
        courseTab[12]._id.toString(),
        courseTab[15]._id.toString(),
      ],
      courseSelection: [
        {
          label: 'Web Avancé',
          credit: 3,
          courses: [courseTab[8]._id.toString(), courseTab[9]._id.toString()],
        },
        {
          label: 'Intelligence artificiel',
          credit: 4,
          courses: [courseTab[4]._id.toString()],
        },
        {
          label: 'Linux',
          credit: 2,
          courses: [courseTab[18]._id.toString()],
        },
        {
          label: 'Langue 3',
          credit: 1,
          courses: [courseTab[12]._id.toString(), courseTab[15]._id.toString()],
        },
      ],
    },
  );

  await educationalClassesRepository.update(
    educationalClasses[3]._id.toString(),
    {
      flattedCourseSelection: [
        courseTab[1]._id.toString(),
        courseTab[16]._id.toString(),
        courseTab[6]._id.toString(),
        courseTab[10]._id.toString(),
        courseTab[13]._id.toString(),
      ],
      courseSelection: [
        {
          label: "Système d'exploitation",
          credit: 2,
          courses: [courseTab[16]._id.toString()],
        },
        {
          label: 'Algorithme',
          credit: 3,
          courses: [courseTab[1]._id.toString()],
        },
        {
          label: 'Mathématique 1',
          credit: 4,
          courses: [courseTab[6]._id.toString()],
        },
        {
          label: 'Langue 1',
          credit: 1,
          courses: [courseTab[10]._id.toString(), courseTab[13]._id.toString()],
        },
      ],
    },
  );

  await educationalClassesRepository.update(
    educationalClasses[4]._id.toString(),
    {
      flattedCourseSelection: [
        courseTab[17]._id.toString(),
        courseTab[2]._id.toString(),
        courseTab[3]._id.toString(),
        courseTab[7]._id.toString(),
        courseTab[11]._id.toString(),
        courseTab[14]._id.toString(),
      ],
      courseSelection: [
        {
          label: 'Sécurité informatique',
          credit: 2,
          courses: [courseTab[17]._id.toString()],
        },
        {
          label: 'Python base',
          credit: 2,
          courses: [courseTab[2]._id.toString()],
        },
        {
          label: 'Java Base',
          credit: 2,
          courses: [courseTab[3]._id.toString()],
        },
        {
          label: 'Mathématique 2',
          credit: 3,
          courses: [courseTab[7]._id.toString()],
        },
        {
          label: 'Langue 2',
          credit: 1,
          courses: [courseTab[11]._id.toString(), courseTab[14]._id.toString()],
        },
      ],
    },
  );

  await educationalClassesRepository.update(
    educationalClasses[5]._id.toString(),
    {
      flattedCourseSelection: [
        courseTab[19]._id.toString(),
        courseTab[4]._id.toString(),
        courseTab[18]._id.toString(),
        courseTab[12]._id.toString(),
        courseTab[15]._id.toString(),
      ],
      courseSelection: [
        {
          label: 'Cloud Computing',
          credit: 3,
          courses: [courseTab[19]._id.toString()],
        },
        {
          label: 'Intelligence artificiel',
          credit: 4,
          courses: [courseTab[4]._id.toString()],
        },
        {
          label: 'Linux',
          credit: 2,
          courses: [courseTab[18]._id.toString()],
        },
        {
          label: 'Langue 3',
          credit: 1,
          courses: [courseTab[12]._id.toString(), courseTab[15]._id.toString()],
        },
      ],
    },
  );
};

/**
 * Create init cursus
 * @param dbScriptService
 */
const createCursus: ScriptFn = async (dbScriptService: DbScriptService) => {
  const cursusRepository = (await dbScriptService.getRepository(
    Cursus,
  )) as CursusRepository;

  for (let cursus of CURSUS_INITIAL) {
    await cursusRepository.create(cursus);
  }
};

/**
 * Create init Candidate
 * @param dbScriptService
 */
const createCandidate: ScriptFn = async (DbScriptService: DbScriptService) => {
  const groupRepository = (await DbScriptService.getRepository(
    Group,
  )) as GroupRepository;

  const roleRepository = (await DbScriptService.getRepository(
    Role,
  )) as RoleRepository;

  const userRepository = (await DbScriptService.getRepository(
    User,
  )) as UserRepository;

  const applicationRepository = (await DbScriptService.getRepository(
    Application,
  )) as ApplicationRepository;

  const countRepository = (await DbScriptService.getRepository(
    Count,
  )) as CountRepository;

  const guestGroup: Group = await groupRepository.findOne({
    name: STUDENT_GROUP,
  });

  const guestRole: any = await roleRepository
    .findOne({ name: CANDIDATE_ROLE })
    .populate(['privileges']);

  const candidates: any = Array.from(
    new Array(candidateToGenerate),
    (_, index): any => {
      const number = faker.random.arrayElement([1, 2]);
      let phoneNumber;

      if (number === 1) {
        phoneNumber = [
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
        ];
      } else {
        phoneNumber = [
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
        ];
      }
      let certification;
      const numberRandom = faker.random.arrayElement([1, 2, 3]);
      if (numberRandom === 1) {
        certification = [
          {
            name: 'Dev',
            institution: 'IFPS',
            startDate: faker.date.between('2020-01-01', '2020-02-01'),
            endDate: faker.date.between('2020-05-01', '2020-06-01'),
            attachement: 'attache.pdf',
          },
        ];
      } else if (numberRandom === 2) {
        certification = [
          {
            name: 'Dev',
            institution: 'IFPS',
            startDate: faker.date.between('2020-01-01', '2020-02-01'),
            endDate: faker.date.between('2020-05-01', '2020-06-01'),
            attachement: 'attache.pdf',
          },
          {
            name: 'Langue 1',
            institution: 'AF',
            startDate: faker.date.between('2020-01-01', '2020-02-01'),
            endDate: faker.date.between('2020-05-01', '2020-06-01'),
            attachement: '',
          },
        ];
      } else {
        certification = [
          {
            name: 'Dev',
            institution: 'IFPS',
            startDate: faker.date.between('2020-01-01', '2020-02-01'),
            endDate: faker.date.between('2020-05-01', '2020-06-01'),
            attachement: 'attache.pdf',
          },
          {
            name: 'DELF Niveau 1',
            institution: 'CNELA',
            startDate: faker.date.between('2020-01-01', '2020-02-01'),
            endDate: faker.date.between('2020-05-01', '2020-06-01'),
            attachement: '',
          },
          {
            name: 'DELF Niveau 2',
            institution: 'CNELA',
            startDate: faker.date.between('2020-01-01', '2020-02-01'),
            endDate: faker.date.between('2020-05-01', '2020-06-01'),
            attachement: 'certification_capture0124412.266.jpg',
          },
        ];
      }
      const newUsername: string = `${CANDIDATE_BASE_USERNAME}${(index + 1)
        .toString()
        .padStart(4, '0')}`;

      const user = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName().toUpperCase(),
        phone: phoneNumber,
        password: candidatePassword,
        email: faker.internet.email(),
        // email: index+'@gmail.com',
        creationDate: new Date(),
        roles: [guestRole._id.toString()],
        username: newUsername,
        filters: USER_DEFAULT_FILTERS,
        address: `${faker.address.streetName()}&&${faker.address.zipCode()}&&${faker.address.city()}`,
        birthDate: faker.date.between('1995-01-01', '2008-12-31'),
        birthPlace: faker.address.city(),
        gender: getRandomGender(),
        groups: [guestGroup._id.toString()],
        photo: 'student-male-default-pdp.jpeg',
        failedConnectionCount: 0,
        isActive: true,
        isDelete: false,
        diploma: [
          {
            name: `BACC`,
            school: 'Ecole 1',
            option: faker.random.arrayElement(['A', 'C', 'D', 'OSE', 'Autre']),
            obtentionYear: faker.random.arrayElement([
              '2016',
              '2017',
              '2018',
              '2019',
              '2020',
              '2021',
              '2022',
              '2023',
            ]),
            attachement: 'attachement.pdf',
          },
        ],
        certification: certification,
        motivation: faker.lorem.paragraphs(10),
        competitionResult: {
          totalTasksNumber: 0,
          finishedTasksNumber: 0,
          TaskDetails: [],
        },
        createdAt: faker.date.between('2023-01-01', '2024-02-01'),
        updatedAt: faker.date.between('2023-01-01', '2024-02-01'),
      };
      return user;
    },
  );
  const usersTab: User[] = [];

  for (let item of candidates) {
    let { diploma, certification, motivation, competitionResult, ...user } =
      item;
    usersTab.push(await userRepository.create(user));
  }

  candidates.map(async (item: any, index: number) => {
    let { diploma, certification, motivation, competitionResult, ...user } =
      item;
    let applicationInfo = {
      user: usersTab[index]._id,
      diploma,
      motivation,
      certification,
    };

    const applicationData: any = {
      ...applicationInfo,
      // applicationStatus: faker.random.arrayElement(
      //   Object.values(ApplicationStatus),
      // ),
      applicationStatus: ApplicationStatus.UNREAD,
      competitionResult: {
        totalTasksNumber: 0,
        finishedTasksNumber: 0,
        TaskDetails: [],
      },
    };
    await applicationRepository.create(applicationData);
  });

  const countQueue: any | null = await countRepository.findOne({});
  await countRepository.update(countQueue._id, {
    countCandidateValue: candidateToGenerate,
  });
};

/**
 * Create init Student
 * @param dbScriptService
 */
const createStudent: ScriptFn = async (DbScriptService: DbScriptService) => {
  const educationalClassesRepository = (await DbScriptService.getRepository(
    EducationalClasses,
  )) as EducationalClassesRepository;

  const courseRepository = (await DbScriptService.getRepository(
    Course,
  )) as CourseRepository;

  const groupRepository = (await DbScriptService.getRepository(
    Group,
  )) as GroupRepository;

  const roleRepository = (await DbScriptService.getRepository(
    Role,
  )) as RoleRepository;

  const userRepository = (await DbScriptService.getRepository(
    User,
  )) as UserRepository;

  const studentRepository = (await DbScriptService.getRepository(
    Student,
  )) as StudentRepository;

  const countRepository = (await DbScriptService.getRepository(
    Count,
  )) as CountRepository;

  const stendentGroup: Group = await groupRepository.findOne({
    name: STUDENT_GROUP,
  });

  const educationalTab = await educationalClassesRepository.find({});

  const studentRole: any = await roleRepository
    .findOne({ name: STUDENT_ROLE })
    .populate(['privileges']);

  const users: any = Array.from(
    new Array(studentToGenerate),
    (_, index): any => {
      const newUsername: string = `${STUDENT_BASE_USERNAME}${(index + 1)
        .toString()
        .padStart(4, '0')}`;
      const number = faker.random.arrayElement([1, 2]);
      let phoneNumber;

      if (number === 1) {
        phoneNumber = [
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
        ];
      } else {
        phoneNumber = [
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
          `${faker.random.arrayElement(phonePrefixes)}${faker.datatype.number({
            min: 1000000,
            max: 9999999,
          })}`,
        ];
      }
      const user = {
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        phone: phoneNumber,
        password: studentPassword,
        email: faker.internet.email().toLocaleLowerCase(),
        creationDate: new Date(),
        roles: [studentRole._id.toString()],
        username: newUsername,
        filters: USER_DEFAULT_FILTERS,
        address: `${faker.address.streetName()}&&${faker.address.zipCode()}&&${faker.address.city()}`,
        birthDate: faker.date.between('1995-01-01', '2008-12-31'),
        birthPlace: faker.address.city(),
        gender: getRandomGender(),
        groups: [stendentGroup._id.toString()],
        photo: 'student-female-default-pdp.jpg',
        failedConnectionCount: 0,
        isActive: true,
        isDelete: false,
        createdAt: faker.date.between('2023-01-01', '2024-02-01'),
        updatedAt: faker.date.between('2023-01-01', '2024-02-01'),
      };
      return user;
    },
  );
  const usersTab: User[] = [];

  for (let item of users) {
    usersTab.push(await userRepository.create(item));
  }

  for (let item of usersTab) {
    const educationalClass =
      educationalTab[Math.floor(Math.random() * educationalTab.length)];
    const cursusAlias = educationalClass.name.toString().split(' ')[1];

    const courseTab = educationalClass.courseSelection.map(
      (course) => course.courses[0],
    );
    const registratedCourses: RegistratedCourse[] = [];
    // for (let i of courseTab) {
    //   const note = faker.datatype.float({ min: 0, max: 20 });
    //   const result = [
    //     {
    //       note: note,
    //       examDate: new Date('2024-04-15'),
    //     },
    //   ];

    //   registratedCourses.push({
    //     course: i._id.toString(),
    //     average: result.reduce((n, { note }) => n + note, 0) / result.length,
    //     result: result,
    //   });
    // }
    studentRepository.create({
      // registrationNumber: item._id.toString(),
      registrationNumber: `${
        item.username.split('-')[1]
      }-${cursusAlias}-${new Date().getFullYear()}`,
      educationalClasses: educationalClass._id.toString(),
      user: item._id.toString(),
      registratedCourse: registratedCourses,
    });
  }
  const countQueue: any | null = await countRepository.findOne({});
  await countRepository.update(countQueue._id, {
    countStudentValue: studentToGenerate,
  });
};
/**
 * Create privileges
 * @param dbScriptService DbscriptService instance
 */
const createInitialPrivilege: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;
  const privilegeNames = Object.values(PrivilegeName);
  const adminGroup: Group = await groupRepository.findOne({
    name: ADMIN_GROUP,
  });
  privilegeNames.forEach(async (privilege, i) => {
    await privilegeRepository.create({
      group: [], // group: [adminGroup._id.toString()],
      name: privilege,
      isChecked: false,
    });
  });
};

/**
 * Create group in privilege
 * @param dbScriptService DbscriptService instance
 */
const createGroupInPrivilege: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const groups: Group[] = await groupRepository.find({});

  const privileges: Privilege[] = await privilegeRepository.find({});

  privileges.map(async (privilege: Privilege) => {
    let matchPrivilege = privilegeWithItsGroup.filter(
      (item) => item.privilege == privilege.name,
    );

    if (matchPrivilege.length > 0) {
      let matchGroups: string[] = matchPrivilege[0].groups;

      let groupToInsert: string[] = [];

      groups.forEach((group) => {
        if (
          matchGroups.some((matchGroup: string) => matchGroup == group.name)
        ) {
          groupToInsert.push(group._id.toString());
        }
      });

      await privilegeRepository.update(privilege._id as string, {
        group: groupToInsert,
      });
    }
  });
};

/**
 * Create Super admin role
 * @param dbScriptService DbscriptService instance
 */
const createSuperAdminRole: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const userRepository = (await dbScriptService.getRepository(
    User,
  )) as UserRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const adminGroup: Group = await groupRepository.findOne({
    name: ADMIN_GROUP,
  });
  const privileges: Privilege[] = await privilegeRepository.find({});

  const privilegesIds: any = [];
  privileges.forEach(async (privilege) => {
    await privilegesIds.push(privilege._id);
  });
  await roleRepository.create({
    name: SUPER_ADMIN_ROLE,
    alias: SUPER_ADMIN_ROLE_ALIAS,
    description: 'Un role pour le SUPER_ADMIN',
    privileges: privilegesIds,
    color: '#ee0d0d',
    groups: [adminGroup._id.toString()],
  });
};

/**
 * Create new role for Admin
 * @param dbScriptService DbscriptService instance
 */
const createNewRoleAdmin: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const adminGroup: Group = await groupRepository.findOne({
    name: ADMIN_GROUP,
  });

  const admin_includFilter = ['CREATE', 'VIEW', 'EDIT'];
  const admin_excludFilter = ['DELETE', 'EDIT_GROUP', 'CREATE_GROUP']000;

  const privileges: Privilege[] = await privilegeRepository
    .find({
      name: { $nin: admin_excludFilter },
    })
    .exec();

  const privilegeIds: [string] = [''];

  privileges.forEach((privilege, i) => {
    privilegeIds[i] = privilege._id.toString();
  });

  const group = roleRepository.create({
    name: ADMIN_1_ROLE,
    alias: ADMIN_1_ROLE_ALIAS,
    description: 'Un role pour le ADMIN_1',
    privileges: privilegeIds,
    color: '#ee0d0d',
    groups: [adminGroup._id.toString()],
  });
};

/**
 * Create new role for Guest
 * @param dbScriptService DbscriptService instance
 */
const createNewRoleCandidate: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const studentGroup: Group = await groupRepository.findOne({
    name: STUDENT_GROUP,
  });

  const student_includFilter = ['VIEW_PROFILE', 'EDIT_PROFILE'];

  const privileges: Privilege[] = await privilegeRepository
    .find({
      name: { $in: student_includFilter },
    })
    .exec();

  const privilegeIds: [string] = [''];

  privileges.forEach((privilege, i) => {
    privilegeIds[i] = privilege._id.toString();
  });

  const group = roleRepository.create({
    name: CANDIDATE_ROLE,
    alias: CANDIDATE_ROLE_ALIAS,
    description: 'Un role pour le Candidat',
    privileges: privilegeIds,
    color: '#B4B4B4',
    groups: [studentGroup._id.toString()],
  });
};

/**
 * Create new role for Guest
 * @param dbScriptService DbscriptService instance
 */
const createNewRoleStudent: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const studentGroup: Group = await groupRepository.findOne({
    name: STUDENT_GROUP,
  });

  const student_includFilter = ['VIEW_PROFILE', 'EDIT_PROFILE'];

  const privileges: Privilege[] = await privilegeRepository
    .find({
      name: { $in: student_includFilter },
    })
    .exec();

  const privilegeIds: [string] = [''];

  privileges.forEach((privilege, i) => {
    privilegeIds[i] = privilege._id.toString();
  });

  await roleRepository.create({
    name: STUDENT_ROLE,
    alias: STUDENT_ROLE_ALIAS,
    description: 'Un role pour les étudiants',
    privileges: privilegeIds,
    color: '#FFA319',
    groups: [studentGroup._id.toString()],
  });
};
const createNewRoleTechniqueTeam: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const tech_includFilter = ['VIEW_USER', 'EDIT_USER'];

  const privileges: Privilege[] = await privilegeRepository
    .find({
      name: { $in: tech_includFilter },
    })
    .exec();

  const techGroup: Group = await groupRepository.findOne({
    name: TECH_GROUP,
  });
  const privilegeIds: [string] = [''];

  privileges.forEach((privilege, i) => {
    privilegeIds[i] = privilege._id.toString();
  });

  await roleRepository.create({
    name: TECH_ROLE,
    alias: TECH_ROLE_ALIAS,
    description: 'Un role pour les équipe technique',
    privileges: privilegeIds,
    color: '#0FC3ED',
    groups: [techGroup._id.toString()],
  });
};
/**
 * Create new role for Candidate
 * @param dbScriptService DbscriptService instance
 */
const createNewRoleGuest: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const studentGroup: Group = await groupRepository.findOne({
    name: GUEST_GROUP,
  });

  const student_includFilter = ['CREATE_USER'];

  const privileges: Privilege[] = await privilegeRepository
    .find({
      name: { $in: student_includFilter },
    })
    .exec();

  const privilegeIds: [string] = [''];

  privileges.forEach((privilege, i) => {
    privilegeIds[i] = privilege._id.toString();
  });
  await roleRepository.create({
    name: GUEST_ROLE,
    alias: GUEST_ROLE_ALIAS,
    description: 'Un role pour le visiteur',
    privileges: privilegeIds,
    color: '#0a0a0a',
    groups: [studentGroup._id.toString()],
  });
};

/**
 * Create new role for Candidate
 * @param dbScriptService DbscriptService instance
 */
const createNewRoleTeacher: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;

  const teacherGroup: Group = await groupRepository.findOne({
    name: TEACHER_GROUP,
  });

  const teacher_includFilter = [
    PrivilegeName.VIEW_COURSE,

    PrivilegeName.VIEW_HISTORY,

    PrivilegeName.VIEW_GROUP,

    PrivilegeName.VIEW_ROLE,

    PrivilegeName.VIEW_CURSUS,

    PrivilegeName.VIEW_PROFILE,
    PrivilegeName.EDIT_PROFILE,

    PrivilegeName.VIEW_APPLICATION,
    PrivilegeName.EDIT_APPLICATION,

    PrivilegeName.VIEW_EDUCATIONAL_CLASSES,
    PrivilegeName.EDIT_EDUCATIONAL_CLASSES,

    PrivilegeName.VIEW_STUDENT,
    PrivilegeName.CREATE_STUDENT,
    PrivilegeName.EDIT_STUDENT,

    PrivilegeName.CREATE_COMMENT,
    PrivilegeName.VIEW_COMMENT,
    PrivilegeName.EDIT_COMMENT,
    PrivilegeName.DELETE_COMMENT,

    PrivilegeName.VIEW_SETTING,
  ];

  const privileges: Privilege[] = await privilegeRepository
    .find({
      name: { $in: teacher_includFilter },
    })
    .exec();

  const privilegeIds: [string] = [''];

  privileges.forEach((privilege, i) => {
    privilegeIds[i] = privilege._id.toString();
  });

  const group = roleRepository.create({
    name: TEACHER_ROLE,
    alias: TEACHER_ROLE_ALIAS,
    description: "Un role pour l'enseignant ",
    privileges: privilegeIds,
    color: '#710FED',
    groups: [teacherGroup._id.toString()],
  });

  await group;
};

/**
 * Create Super Admin User with username and password from configuration (.env)
 * @param dbScriptService DbScriptService instance
 */
const createSuperAdminUser: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const userRepository = (await dbScriptService.getRepository(
    User,
  )) as UserRepository;
  const groupRepository = (await dbScriptService.getRepository(
    Group,
  )) as GroupRepository;
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;

  const adminGroup: Group = await groupRepository.findOne({
    name: ADMIN_GROUP,
  });
  const adminRole: Role = await roleRepository.findOne({
    name: SUPER_ADMIN_ROLE,
  });

  await userRepository.create({
    firstname: 'SUPER_ADMIN',
    lastname: 'SUPER_ADMIN',
    username: configuration().superAdmin.login,
    address: 'adminAddress&&&adminCodePostal&&adminCity',
    password: configuration().superAdmin.password,
    email: 'no-reply@gmail.com',
    phone: ['000-000-000', '111-111-111'],
    gender: GENDER.MALE,
    birthPlace: 'adminBirthPlace',
    birthDate: new Date(),
    photo: 'admin-male-default-pdp.jpg',
    groups: [adminGroup._id.toString()],
    roles: [adminRole._id.toString()],
    creationDate: new Date(),
    failedConnectionCount: 0,
    filters: [],
    isActive: true,
    isDelete: false,
  });
};

/**
 * Create counter for all
 *  * @param dbScriptService DbScriptService instance
 */
const createCount: ScriptFn = async (dbScriptService: DbScriptService) => {
  const countRepository = (await dbScriptService.getRepository(
    Count,
  )) as CountRepository;
  const countTemp: any = {
    countCandidateValue: 0,
    countStudentValue: 0,
  };

  await countRepository.create(countTemp);
};

export const insertEventsMockData: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const eventRepository = (await dbScriptService.getRepository(
    SchoolEvent,
  )) as EventRepository;
  const events: SchoolEvent[] = Array.from({ length: 30 }, (): SchoolEvent => {
    return {
      name: faker.random.words(),
      description: faker.lorem.sentence(),
      type: faker.random.arrayElement([EventType.SCHOOL_EVENT]),
      isDeleted: faker.random.arrayElement([true, false]),
      startDate: faker.date.recent(),
      endDate: faker.date.future(),
    };
  });

  for (const event of events) {
    await eventRepository.create(event);
  }
};

export const scripts: ScriptFn[] = [
  createCount,
  createCursus,
  createGroups,
  createInitialPrivilege,
  createGroupInPrivilege,
  createRegistrationPeriod,
  createSuperAdminRole,
  createNewRoleAdmin,
  createNewRoleCandidate,
  createNewRoleTeacher,
  createNewRoleStudent,
  createNewRoleGuest,
  createNewRoleTechniqueTeam,
  createSuperAdminUser,
  createTeacher,
  createEducationalClasses,
  createCourseSession,
  createCourses,
  updateEducationalClasses,
  createCandidate,
  createStudent,
  insertEventsMockData,
  //insertUserdPermissions,
  //insertRoledPermissions,
];
