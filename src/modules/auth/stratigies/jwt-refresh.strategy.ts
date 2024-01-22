import {
  Injectable,
  Inject,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import appConfig from '../../../config/app.config';
import { UserService } from '../../../modules/user/user.service';
import { JwtPayload } from '../interfaces';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(appConfig.KEY) configService: ConfigType<typeof appConfig>,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.app.refreshTokenSecret,
    });
  }

  async validate(payload: JwtPayload) {
    const { authUid } = payload;

    const user = await this.userService.findOne({
      authUid,
      checkIfExists: false,
    });

    if (!user) throw new UnauthorizedException();

    if (!user.verifiedEmail)
      throw new ForbiddenException(
        'your account must be verified to access resources.',
      );

    if (!user.isActive) throw new UnauthorizedException('user is inactive.');

    delete user.password;

    return user;
  }
}
