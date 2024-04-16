import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { LoginResponseDto } from '../auth/dto/login-responce.dto';
import { GenericApiOkResponse } from '../core/decorators/generic-api-ok-response.decorator';
import { HttpResponseService } from '../core/services/http-response/http-response.service';
import { PrivilegeName } from '../privilege/entities/privilege.entity';
import { ListCriteria } from '../shared/types/list-criteria.class';
import { CreateUserDto } from './dto/create-user.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { PaginatedUsers } from './paginated-users.interface';
import { UserService } from './user.service';
import { RequirePrivilege } from '../core/decorators/require-privilege.decorator';
import { updatePasswordDto } from './dto/update-password.dto';
import { HistoryWithData } from '../history/dto/create-history-with-data';

/**
 * Controller for User layer
 */
@Controller('user')
export class UserController {
  /**
   * Constructor for UserController
   * @param userService Injected User Service
   */
  constructor(private readonly userService: UserService) {}

  /**
   * Get paginated list of User based on list criteria
   * @param queryParams List criteria to find Users
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'List users',
    type: User,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_USER)
  @Get('/role')
  async getCountUserByrole(@Res() res: FastifyReply) {
    const results: any = await this.userService.getCountUserByRole();
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, results);
  }

  /**
   * Get paginated list of User based on list criteria
   * @param queryParams List criteria to find Users
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'List users',
    type: User,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_USER)
  @Get()
  async getUser(@Res() res: FastifyReply) {
    const results: User[] = await this.userService.findAll();
    HttpResponseService.sendSuccess<User[]>(res, HttpStatus.OK, results);
  }
  /**
   * Get paginated list of User based on list criteria
   * @param queryParams List criteria to find Users
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Paginated users',
    type: User,
    isArray: false,
  })
  @RequirePrivilege(PrivilegeName.VIEW_USER)
  @Get('list')
  async getPaginated(
    @Query() queryParams: ListCriteria,
    @Res() res: FastifyReply,
  ) {
    // console.log('Query=>', queryParams);

    const results: PaginatedUsers = await this.userService.getPaginated(
      queryParams,
    );
    HttpResponseService.sendSuccess<PaginatedUsers>(
      res,
      HttpStatus.OK,
      results,
    );
  }

  /**
   * Find User by its _id
   * @param id _id of given User
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The corresponding record to the id',
    type: User,
  })
  @RequirePrivilege(PrivilegeName.VIEW_USER, PrivilegeName.VIEW_PROFILE)
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() res: FastifyReply) {
    const result = await this.userService.findOne(id);
    HttpResponseService.sendSuccess<User>(res, HttpStatus.OK, result);
  }

  /**
   * Create user
   * @param createUserDto User that will be create
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created user record',
    type: User,
  })
  // @RequirePrivilege(PrivilegeName.CREATE_USER)
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: FastifyReply) {
    // console.log(createUserDto);
    const result = await this.userService.create(createUserDto);
    HttpResponseService.sendSuccess<User>(res, HttpStatus.CREATED, result);
  }

  /**
   * Get user privileges
   * @param createUserDto user_Id
   * @param res Fastify response
   */
  @Get('/user-privileges/:userId')
  async GetUserPrivileges(
    @Param('userId') userId: string,
    @Res() res: FastifyReply,
  ) {
    console.log('controller ', userId);
    const result = await this.userService.getPrivilegeNamesByUserId(userId);
    HttpResponseService.sendSuccess<User>(res, HttpStatus.OK, result);
  }

  /**
   * Create Candidate
   * @param createUserDto User that will be create
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created candidate record',
    type: User,
  })
  @Post('candidate')
  async createCandidate(
    @Body() createUserDto: CreateUserDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.userService.createUserCandidate(createUserDto);

    HttpResponseService.sendSuccess<User>(res, HttpStatus.CREATED, result);
  }

  /**
   * Update User
   * @param id _id of User
   * @param updateUserDto update of User
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'The updated user record',
    type: User,
  })
  @RequirePrivilege(PrivilegeName.EDIT_USER, PrivilegeName.EDIT_PROFILE)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: HistoryWithData,
    @Res() res: FastifyReply,
  ) {
    const result = await this.userService.update(id, updateUserDto);
    HttpResponseService.sendSuccess<User>(res, HttpStatus.OK, result);
  }

  /**
   * Check duplicated email or userName
   * @param userToCheckDuplication partial User
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'Check duplicated entry',
    type: Boolean,
  })
  // @RequirePrivilege(PrivilegeName.EDIT_USER)
  @Post('check-duplication')
  async checkDuplication(
    @Body() userToCheck: UpdateUserDto,
    @Res() res: FastifyReply,
  ) {
    const result = await this.userService.checkDuplication(userToCheck);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }

  /**
   * Remove User with specific _id
   * @param id _id of User to be deleted
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'Check if delete is successful',
    type: Boolean,
  })
  @RequirePrivilege(PrivilegeName.DELETE_USER)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() res) {
    const result = await this.userService.remove(id);
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.OK, result);
  }

  /**
   * Request password reset,
   * @param passwordResetDto Dto with user email
   * @param res Fastify Response
   */
  @Post('request-password-reset')
  async requestPasswordReset(
    @Body() passwordResetDto: RequestPasswordResetDto,
    @Res() res,
  ) {
    const token = await this.userService.requestPasswordReset(
      passwordResetDto.email,
    );
    HttpResponseService.sendSuccess<String>(res, HttpStatus.OK, token);
  }

  /**
   * Reset password, the request must include valid token and new password
   * @param resetPasswordDto Dto with token and new password
   * @param res Fastify response
   */
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Res() res) {
    const result = await this.userService.resetPassword(
      resetPasswordDto.password,
      resetPasswordDto.token,
    );
    HttpResponseService.sendSuccess<LoginResponseDto>(
      res,
      HttpStatus.OK,
      result,
    );
  }

  /**
   * Update User
   * @param id _id of User
   * @param updateUserDto update of User
   * @param res Fastify Response
   */
  @GenericApiOkResponse({
    description: 'The updated user candidate',
    type: User,
  })
  // @RequirePrivilege(PrivilegeName.EDIT_USER)
  @Patch('update-candidate/:id')
  async updateCandidatePass(
    @Param('id') id: string,
    @Body() body: any,
    @Res() res: FastifyReply,
  ) {
    const result = await this.userService.updateCandidate(id, body);
    HttpResponseService.sendSuccess<User>(res, HttpStatus.OK, result);
  }

  /**
   * find User By user name
   * @param createUserDto User that will be create
   * @param res Fastify response
   */
  @GenericApiOkResponse({
    description: 'The created user record',
    type: User,
  })
  @Post('check-username')
  async findByUsername(@Body() body: any, @Res() res: FastifyReply) {
    const username = body.username;
    const user = await this.userService.findByUserName(username);
    if (user !== null) {
      HttpResponseService.sendSuccess<boolean>(res, HttpStatus.CREATED, true);
    }
    HttpResponseService.sendSuccess<boolean>(res, HttpStatus.CREATED, false);
  }

  /**
   * Get Group count
   * @param res
   */
  // @RequirePrivilege(PrivilegeName.VIEW_GROUP)
  @Get('group-count')
  async getGroupCount(@Res() res: FastifyReply) {
    const result = await this.userService.getGroupCount();
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }

  /**
   * Get Group count
   * @param res
   */
  // @RequirePrivilege(PrivilegeName.VIEW_ROLE)
  @Get('role-count')
  async getRoleCount(@Res() res: FastifyReply) {
    const result = await this.userService.getRolesCount();
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }

  /**
   * Get Group count
   * @param res
   */
  // @RequirePrivilege(PrivilegeName.VIEW_USER)
  @Get('activity-count')
  async getActivityCount(@Res() res: FastifyReply) {
    const result = await this.userService.getStatusCount();
    HttpResponseService.sendSuccess<any>(res, HttpStatus.OK, result);
  }
}
