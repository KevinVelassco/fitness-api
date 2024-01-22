import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from './../auth.service';
import { User } from '../../../modules/user/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    const user = await this.authService.validateUser({ email, password });

    if (!user)
      throw new UnauthorizedException(
        'the email/password you entered is incorrect. Verify your credentials to log in.',
      );

    if (!user.verifiedEmail)
      throw new ForbiddenException(
        'your account must be verified to access resources.',
      );

    if (!user.isActive) throw new UnauthorizedException('user is inactive.');

    return user;
  }
}
