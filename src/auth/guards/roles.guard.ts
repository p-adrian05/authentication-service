import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../../roles/dto/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role as RoleEntity} from '../../roles/entity/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { currentUser } = context.switchToHttp().getRequest();
    if(!currentUser || !currentUser.roles || currentUser.roles.length === 0){
      return false;
    }
    const currentRoleNames = currentUser.roles.map((role:RoleEntity) => role.name);
    return requiredRoles.some((role:Role) => currentRoleNames.includes(role));
  }
}