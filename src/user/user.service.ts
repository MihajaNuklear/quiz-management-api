import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../auth/auth.service';
import { LoginResponseDto } from '../auth/dto/login-responce.dto';
import { CONFIGURATION_TOKEN_DI } from '../config/configuration-di.constant';
import { ConfigurationType } from '../config/configuration.interface';
import {
  TokenRequest,
  TokenRequestType,
} from '../token-request/entities/token-request.entity';
import { TokenRequestService } from '../token-request/token-request.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginatedUsers } from './paginated-users.interface';
import {
  USER_DEFAULT_FILTERS,
  USER_LOOKUP_STAGES,
  USER_SEARCH_FIELDS,
} from './user.constants';
import { UserRepository } from './user.repository';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { Role } from '../role/entities/role.entity';
import { RoleService } from '../role/role.service';
import { RoleRepository } from '../role/role.repository';
import { PrivilegeService } from '../privilege/privilege.service';
import { CreateSuperAdminDto } from './dto/create-superAdminDto';
import { GroupService } from '../group/group.service';
import { Group } from '../group/entities/group.entity';
import conf from '../config/configuration.constant';
import { MailQueueStatus } from '../mail-queue/entities/mail-queue.entity';
import { MailQueueService } from '../mail-queue/mail-queue.service';
import { ListCriteria } from '../shared/types/list-criteria.class';
import {
  CANDIDATE_ROLE,
  STUDENT_GROUP,
} from '../db-script/db-script.constants';
import { HistoryService } from '../history/history.service';
import { updatePasswordDto } from './dto/update-password.dto';
interface PrivilegeType {
  _id: string;
  name: string;
  group: string;
}

/**
 * Service for User layer
 */
@Injectable()
export class UserService {
  /**
   * Constructor of UserService
   * @param userRepository Injected User Repository
   * @param roleRepository Injected RoleRepository
   * @param tokenRequestService Injected TokenRequestService
   * @param mailNotificationService Injected MailNotificationService
   * @param authService Injected AuthService
   * @param configuration Injected Application Configuration
   */
  // eslint-disable-next-line max-params
  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly tokenRequestService: TokenRequestService,
    private readonly roleService: RoleService,
    private readonly groupService: GroupService,
    private readonly privilegeService: PrivilegeService,
    private readonly mailQueueService: MailQueueService,
    private readonly historyService: HistoryService,
    @Inject('authService') private readonly authService: AuthService,
    @Inject(CONFIGURATION_TOKEN_DI)
    private readonly configuration: ConfigurationType,
  ) {}

  /**
   * Create User
   * @param createUserDto User to be created
   * @returns Created User
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser: User = await this.userRepository.create({
      ...createUserDto,
      photo: 'student-male-default-pdp.jpeg',
      creationDate: new Date(),
      filters: [...USER_DEFAULT_FILTERS],
    });
    await this.requestInitPassword(createdUser);
    return createdUser;
  }

  async findAll() {
    const result = await this.userRepository
      .find({ isDelete: false })
      .populate(['groups', 'roles']);
    return result;
  }

  async getCountUserByRole() {
    const users = await this.userRepository.find({ isDelete: false });
    const roleCounts: Record<string, number> = {};
    users.forEach((user) => {
      user.roles.forEach((idRole) => {
        if (roleCounts[idRole]) {
          roleCounts[idRole]++;
        } else {
          roleCounts[idRole] = 1;
        }
      });
    });

    const convertToTab: { id: string; count: number }[] = Object.keys(
      roleCounts,
    ).map((key) => ({
      id: key,
      count: roleCounts[key],
    }));

    return convertToTab;
  }

  /**
   * Find All Group Count
   * @param res
   */
  async getGroupCount() {
    const result = await this.userRepository
      .find({ isDelete: false })
      .populate('groups')
      .exec();
    const groupedResult = result.reduce((acc, doc) => {
      const groups = doc.groups;

      groups.forEach((group: any) => {
        acc[group.name] = (acc[group.name] || 0) + 1;
      });

      return acc;
    }, {});

    const items = Object.keys(groupedResult).map((name) => ({
      name,
      count: groupedResult[name],
    }));

    return { items, totalNumber: result.length };
  }

  /**
   * Find All Role Count
   * @param res
   */
  async getRolesCount() {
    const result = await this.userRepository
      .find({ isDelete: false })
      .populate('roles')
      .exec();
    const groupedResult = result.reduce((acc, doc) => {
      const roles = doc.roles;

      roles.forEach((role: any) => {
        acc[role.name] = (acc[role.name] || 0) + 1;
      });

      return acc;
    }, {});
    const items = Object.keys(groupedResult).map((name) => ({
      name,
      count: groupedResult[name],
    }));

    return { items, totalNumber: result.length };
  }

  /**
   * Find All Status Activity Count
   * @param res
   */
  async getStatusCount() {
    const isActiveResult = await this.userRepository
      .find({ isActive: true, isDelete: false })
      .count()
      .exec();
    const isNotActiveResult = await this.userRepository
      .find({ isActive: false, isDelete: false })
      .count()
      .exec();

    const result = await this.userRepository.find({}).exec();
    const groupedResult = [
      { name: 'Actif', count: isActiveResult },
      { name: 'Inactif', count: isNotActiveResult },
    ];

    return { items: groupedResult, totalNumber: result.length };
  }

  /**
   * Create User
   * @param createUserDto User to be created
   * @returns Created User
   */
  async createUserCandidate(createUserDto: CreateUserDto): Promise<User | any> {
    const candidateGroup: Group = await this.groupService.findOneGroup(
      STUDENT_GROUP,
    );

    const candidateRole = await this.roleService.findOneByName(CANDIDATE_ROLE);

    const createdUser: User = await this.userRepository.create({
      ...createUserDto,
      creationDate: new Date(),
      photo: 'defaultPdp.jpg',
      filters: [...USER_DEFAULT_FILTERS],
      groups: [candidateGroup._id.toString()],
      roles: [candidateRole._id.toString()],
    });

    await this.requestInitPassword(createdUser);
    return createdUser;
  }

  /**
   * Create superAdmin service
   * @param createSuperAdminDto
   * @returns
   */
  async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto) {
    const createSuperAdmin: User = await this.userRepository.create(
      createSuperAdminDto,
    );
    return createSuperAdmin;
  }

  /**
   * Create guest user
   * @param createGuest
   * @returns
   */
  async createGuest(createGuest) {
    const user: User = await this.userRepository.create(createGuest);
    return user;
  }

  /**
   * Get paginated Users and list , based on list criteria
   * @param criteria criteria used to find Users
   * @returns Paginated Users
   */
  async getPaginated(criteria: ListCriteria): Promise<PaginatedUsers> {
    const paginatedUsers = await this.userRepository.getByListCriteria(
      criteria as ListCriteria,
      USER_SEARCH_FIELDS,
      USER_LOOKUP_STAGES,
      { isDelete: false },
    );

    return {
      ...paginatedUsers,
      pageNumber: Math.ceil(paginatedUsers.totalItems / criteria.pageSize),
    };
  }

  /**
   * Find User with specific _id
   * @param id _id of User
   * @returns User corresponding to id, otherwise undefined
   */
  async findOne(id: string): Promise<User | undefined> {
    return (await this.userRepository.findById(id)).populate([
      'groups',
      'roles',
    ]);
  }

  /**
   * Find User by username
   * @param userName username of the User
   * @returns User corresponding to id, otherwise undefined
   */
  async findByUserName(userName: string): Promise<User | undefined | any> {
    const user = await this.userRepository
      .findOne({ username: userName, isDelete: false })
      .lean()
      .exec();

    return user;
  }

  async findPrivilegebyId(id: string): Promise<User | undefined | any> {
    const user = await this.userRepository
      .findOne({ id, isDelete: false })
      .populate('privileges')
      .lean()
      .exec();

    return user;
  }

  /**
   * Update User with specific Id
   * @param id Id of User
   * @param updateUserDto Partial of User containing the update
   * @returns Updated User
   */
  async update(id: string, updateUserDto: any): Promise<any> {
    const updatedUser = await this.userRepository.update(id, {
      ...updateUserDto.data,
    });
    if (updatedUser) {
      console.log(updateUserDto.history);
      
      this.historyService.create(updateUserDto.history);
    } else {
      return null;
    }
    return updatedUser;
  }

  /**
   * Check if there is duplication on email or userName
   * @param userToCheck Partial of User containing the email and userName to check
   * @returns boolean
   */
  async checkDuplication(userToCheck: UpdateUserDto): Promise<boolean> {
    const duplicationCount = await this.userRepository.count({
      $or: [{ email: userToCheck.email }, { userName: userToCheck.username }],
    });
    return duplicationCount > 0;
  }

  /**
   * Find User by its _id
   * @param id Id of User
   * @returns User corresponding to _id, otherwise undefined
   */
  async findById(id: string): Promise<User | undefined> {
    return this.userRepository.findById(id);
  }

  /**
   * Remove User with specific _id
   * @param id Id of User
   * @returns true if deletion is successful, false otherwise
   */
  remove(id: string): Promise<boolean> {
    // console.log(id)
    return this.userRepository.delete(id);
  }

  /**
   * Get Privilege Names by User Id
   * @param userId User Id
   * @returns List of Privilege Names affected to the user id
   */
  async getPrivilegeNamesByUserId(
    userId: string,
  ): Promise<PrivilegeName[] | any> {
    const user: User | undefined = await this.userRepository
      .findById(userId)
      .populate('roles')
      .exec();

    if (!user) {
      return [];
    }

    const userRoles: Role[] = await this.roleRepository.find({
      _id: { $in: user.roles },
    });
    const rolesId = userRoles.map((role) => role._id);

    const userPrivilegeNames = await Promise.all(
      rolesId.map(async (role) => {
        const roleId = role.toString();
        const rolePrivileges = await this.roleService.findPrivilegeById(roleId);

        const privilegeNames = rolePrivileges.map((privilege) => {
          return privilege.name;
        });
        return privilegeNames;
      }),
    );
    return userPrivilegeNames;
  }

  /**
   * Find User by its email
   * @param email User email
   * @returns User if found, undefined otherwise
   */
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ email }).lean().exec();
  }

  /**
   * Request password request for given user email
   * @param email User email
   */
  async requestPasswordReset(email: string) {
    const user: User | undefined = await this.findUserByEmail(email);
    if (!user) {
      // throw new BadRequestException({
      //   errorDetails: `L'utilisateur avec l'email ${email} n'existe pas. Veuillez contacter votre administrateur.`,
      // });
      return null;
    } else {
      const { token }: TokenRequest =
        await this.tokenRequestService.requestTokenForPasswordReset(user);
      if (user) {
        const userEmail = user.email;

        const mailOption = {
          to: userEmail,
          from: conf().mail.smtpUser,
          subject: 'RESET',
          html: token,
          status: MailQueueStatus.NOT_SENT,
          sendAttemptCount: 0,
        };

        await this.mailQueueService.create(mailOption);
      }
      return token;
    }
  }

  /**
   * Request password reinitialisation for given User
   * @param user Current User
   */
  async requestInitPassword(user: User) {
    const { token }: TokenRequest =
      await this.tokenRequestService.requestTokenForAccountCreation(user);
  }

  /**
   * Set isActive flag of the user
   * @param isActive is active
   */
  async setActive(userId: string, isActive: boolean) {
    await this.userRepository.update(userId, { isActive });
  }

  /**
   * Increment failed connection
   * @param user concerned user
   */
  async incrementFailedConnection(user: User) {
    await this.userRepository.update(user._id as string, {
      failedConnectionCount: (user?.failedConnectionCount ?? 0) + 1,
    });
  }

  /**
   * Reset failed connection
   * @param user concerned user
   */
  async resetFailedConnection(user: User) {
    await this.userRepository.update(user._id as string, {
      failedConnectionCount: 0,
    });
  }

  /**
   * Handle too many failed connection
   * @param user User with to many attempt
   */
  async handleTooManyFailedConnection(user: User) {
    const response =
      await this.tokenRequestService.requestTokenForPasswordReset(user);
    return response;
  }

  /**
   * Get signed User that contains informations about user and jwt token
   * @param user User
   * @returns LoginResponseDto which contains information about user and jwt token
   */
  async getSignedUser(user: User): Promise<LoginResponseDto> {
    return this.authService.login(user);
  }

  /**
   * Reset User password
   * @param password New password
   * @param token Token used for password resetting
   * @returns LoginResponseDto which contains informations about user and jwt token
   */
  async resetPassword(
    password: string,
    token: string,
  ): Promise<LoginResponseDto> {
    await this.tokenRequestService.checkTokenValidity(token, [
      TokenRequestType.RESET_PASSWORD,
      TokenRequestType.ACCOUNT_CREATION,
    ]);

    const user: User = await this.tokenRequestService.getUserByToken(token);
    console.log(user);

    await this.userRepository.model.populate(user, 'roles');
    await this.userRepository.update(user._id as string, {
      password: await bcrypt.hash(password, 10),
    });
    await this.tokenRequestService.markTokenAsUsed(token);
    await this.resetFailedConnection(user);
    await this.setActive(user._id as string, true);
    return this.getSignedUser(user);
  }

  /**
   * Reset User password
   * @param password New password
   * @param token Token used for password resetting
   * @returns LoginResponseDto which contains informations about user and jwt token
   */
  async updateCandidate(userId: string, body: any): Promise<any> {
    const { username, password } = body;
    return await this.userRepository.update(userId as string, {
      password: await bcrypt.hash(password, 10),
      username: username,
    });
  }

  /**
   * Update last connectionDate of User
   * @param userId User Id
   */
  async updateLastConnectionDate(userId: string) {
    await this.userRepository.model
      .findByIdAndUpdate(userId, {
        $set: { lastConnectionDate: new Date() },
      })
      .exec();
  }
}
