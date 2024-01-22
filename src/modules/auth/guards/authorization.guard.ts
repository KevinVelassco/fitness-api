import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { IS_ADMIN_KEY } from '../../../common/decorators';
import { User } from '../../../modules/user/user.entity';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!isAdmin) return true;

    const request = context.switchToHttp().getRequest();

    const user = request.user as User;

    if (!user.isAdmin) throw new NotFoundException();

    return user.isAdmin;
  }
}
