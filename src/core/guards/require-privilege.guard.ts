import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { CONFIGURATION_TOKEN_DI } from '../../config/configuration-di.constant';
import { ConfigurationType } from '../../config/configuration.interface';
import { UserService } from '../../user/user.service';
import { REQUIRE_PRIVILEGE_KEY } from '../decorators/require-privilege.decorator';
import {
  Privilege,
  PrivilegeName,
} from '../../privilege/entities/privilege.entity';

/**
 * Guard that prevent user without specified Privilege to access the resource
 */
@Injectable()
export class RequirePrivilegeGuard
  extends AuthGuard('jwt')
  implements CanActivate {
  /**
   * Contrucotr of RequirePrivilegeGuard Class
   * @param reflector Injected reflector
   * @param userService Injected User Service
   * @param jwtService Injected Jwt Service
   * @param configuration Injected Configuration
   */
  constructor(
    private readonly reflector: Reflector,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(CONFIGURATION_TOKEN_DI)
    private readonly configuration: ConfigurationType,
  ) {
    super();
  }

  /**
   * check if the user has the Privilege to access the resource
   * Can be applied to fucntion or to controller
   * @param context execution context
   * @returns Promise of boolean, true if the user has the required Privilege, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log( " bearerApiKey ======================================================")
    const requestApiKey = context.switchToHttp().getRequest();
    const bearerApiKey = requestApiKey.headers.authorization;

    console.log(bearerApiKey)
    console.log( "bearerApiKey ======================================================")
    const requiredPrivilegeNames = this.reflector.getAllAndOverride<
      PrivilegeName[]
    >(REQUIRE_PRIVILEGE_KEY, [context.getHandler(), context.getClass()]);
    console.log('REQUIRE PRIVILEGE NAMES: ' + requiredPrivilegeNames);

    if (!requiredPrivilegeNames) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const bearerToken = request.headers.authorization; // Assuming that the bearer token is passed in the 'Authorization' header

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      return false;
    }

    const token = bearerToken.substring(7); // Remove the 'Bearer ' prefix
    // console.log('BEARER TOKEN: ' + token);

    let user;
    try {
      user = this.jwtService.verify(token, {
        secret: this.configuration.jwt.secretKey,
      });
    } catch (error) {
      console.log(error);

      return false;
    }
    const userPrivilegeNames: PrivilegeName[] =
      await this.userService.getPrivilegeNamesByUserId(user._id);

    const havePrivilege = requiredPrivilegeNames.some(
      (requiredPrivilegeName) => {
        const isInclided = userPrivilegeNames.map((userPrivilegeName) => {
          return userPrivilegeName.includes(requiredPrivilegeName);
        })
        return isInclided.some((val) => val === true)
      },
    );
    console.log("HAVE PRIVILEGE: " + havePrivilege);

    return havePrivilege;
  }
}
