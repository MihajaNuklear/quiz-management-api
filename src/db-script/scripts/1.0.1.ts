import { Role, RoleType } from '../../role/entities/role.entity';
import { RoleRepository } from '../../role/role.repository';
import { User } from '../../user/entities/user.entity';
import { DbScriptService } from '../db-script.service';
import { ScriptFn } from '../dto/script-fn.interface';
import { UserRepository } from './../../user/user.repository';
import { Privilege } from '../../privilege/entities/privilege.entity';
import { PrivilegeRepository } from '../../privilege/permission.repository';

/**
 * GENERATED USERS
 */
const USERS_NB = 50;

/**
 * List of mock entities
 */

/**
 * number of roles to be generated
 */
const ROLES_NB = 5;

/**
 * Role names used for generating mock data
 */
const ROLE_NAMES = [
  'ADMINISTRATEUR 1',
  'ADMINISTRATEUR 2',
  'STUDENT 1',
  'STUDENT 2',
  'TEACHER 1',
  'TEACHER 2',
];

/**
 * Insert user mock data
 * @param dbScriptService DbScriptService instance
 */
// const insertCandidateMockData: ScriptFn = async (
//   dbScriptService: DbScriptService,

// ) => {
//   const userRepository = (await dbScriptService.getRepository(
//     User
//   )) as UserRepository;
//   const applicationRepository = ApplicationService

//   const roleRepository = (await dbScriptService.getRepository(
//     Role
//   )) as RoleRepository;

//   const groupService = (await dbScriptService.getRepository(Group)) as GroupRepository

//   const candidateRole: Role = await roleRepository.findOne({ name: CANDIDATE_ROLE })

//   const candidateGroup: Group = await groupService.findOne({ NAME: STUDENT_GROUP })

//   const users: CreateUserDto[] = Array.from(new Array(USERS_NB), (): CreateUserDto => {
//     const firstname = faker.name.firstName()

//     return {
//       firstname: firstname,
//       lastname: faker.name.lastName(),
//       phone: [faker.phone.phoneNumber()],
//       email: faker.internet.email(),
//       creationDate: faker.date.recent(),
//       roles: [candidateRole._id.toString()],
//       username: firstname,
//       filters: USER_DEFAULT_FILTERS,
//       address: faker.address.streetAddress(),
//       birthDate: faker.date.past(),
//       birthPlace: faker.address.city(),
//       gender: GENDER.MALE,
//       groups: [candidateGroup._id.toString()],
//       photo: faker.image.avatar(),
//       failedConnectionCount: 0,
//       isActive: true,
//     };
//   }
//   );
//   for (const user of users) {
//     await applicationRepository.createCandidate(user);
//   }
// };

/**
 * Update roles mock data to be full permissions
 * @param dbScriptService DbScriptService instance
 */
const updateRolesMockDatasToBeFullPermissions = async (
  dbScriptService: DbScriptService,
) => {
  const roleRepository = (await dbScriptService.getRepository(
    Role,
  )) as RoleRepository;
  const rolesMock: Role[] = await roleRepository
    .find({ 'role.type': { $ne: RoleType.SUPER_ADMIN } })
    .lean()
    .exec();
  const privilegeRepository = (await dbScriptService.getRepository(
    Privilege,
  )) as PrivilegeRepository;
  const privileges: Privilege[] = await privilegeRepository
    .find({})
    .lean()
    .exec();
  // for (const role of rolesMock) {
  //   await roleRepository.update(role._id as string, { privileges: privileges });
  // }
};

/**
 * Get users count by role
 * @param roleId
 * @param dbScriptService
 * @returns count of users by Role
 */
const getUsersCountByRole = async (
  roleId: string,
  dbScriptService: DbScriptService,
) => {
  const userRepository = (await dbScriptService.getRepository(
    User,
  )) as UserRepository;
  const usersCount = await userRepository.count({ role: roleId });
  return usersCount;
};

/**
 * Update roles mock data to set nbPersmissions and nbUsers
 * @param dbScriptService
 */
const updateRolesMockDatasToGetPermissionsAndUsersCount = async (
  dbScriptService: DbScriptService,
) => {
  // const roleRepository = (await dbScriptService.getRepository(
  //   Role
  // )) as RoleRepository;
  // const rolesMock: Role[] = await roleRepository
  //   .find({ "role.type": { $ne: RoleType.SUPER_ADMIN } })
  //   .lean()
  //   .exec();
  // for (const role of rolesMock) {
  //   const nbPermissions = role.permissions.length;
  //   const nbUsers = await getUsersCountByRole(
  //     role._id as string,
  //     dbScriptService
  //   );
  //   await roleRepository.update(role._id as string, {
  //     nbPermissions,
  //     nbUsers,
  //   });
  // }
};

const updateRoleNameForUsersMockData: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  // const userRepository = (await dbScriptService.getRepository(
  //   User
  // )) as UserRepository;
  // const roleRepository = (await dbScriptService.getRepository(
  //   Role
  // )) as RoleRepository;
  // const users: User[] = await userRepository.find({}).lean().exec();
  // for (const user of users) {
  //   const role: Role = await roleRepository
  //     .findOne({ _id: user.role })
  //     .lean()
  //     .exec();
  //   await userRepository.update(user._id as string, {
  //     roleName: role.name,
  //   });
  // }
};

const activateAllCurrentUsers: ScriptFn = async (
  dbScriptService: DbScriptService,
) => {
  const userRepository = (await dbScriptService.getRepository(
    User,
  )) as UserRepository;
  await userRepository.model.updateMany({}, { $set: { isActive: true } });
};

/**
 *  holds list of scripts that will be executed forl 1.0.1
 */
export const scripts: ScriptFn[] = [
  // insertCandidateMockData
  // insertRolesMockData,
  // insertUsersMockData,
  // updateRolesMockDatasToBeFullPermissions,
  // updateRolesMockDatasToGetPermissionsAndUsersCount,
  // updateRoleNameForUsersMockData,
  // activateAllCurrentUsers,
];
