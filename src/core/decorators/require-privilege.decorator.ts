import { SetMetadata } from '@nestjs/common';
import { PrivilegeName } from '../../privilege/entities/privilege.entity';

/**
 * Require Privilege key used for identifying require Privilege decorator
 */
export const REQUIRE_PRIVILEGE_KEY = 'REQUIRE_PRIVILEGE_KEY';

/**
 * Create RequirePrivilege Decorators
 * This decorator indicates the list of required privilege for the resource
 * @param privilegeNames List of Privilege
 * @returns privilege Decorator
 */
export const RequirePrivilege = (...privilegeNames: PrivilegeName[]) =>
  SetMetadata(REQUIRE_PRIVILEGE_KEY, privilegeNames);
