import { ConflictException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import appConfig from '../../config/app.config';
import { User } from '../user/user.entity';
import { JwtPayload } from './interfaces';
import { LoginAuthInput, TokensResponse } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(loginAuthInput: LoginAuthInput): Promise<User | null> {
    const { email, password } = loginAuthInput;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    const checkPassword = await user.checkPassword(password);

    if (checkPassword) {
      delete user.password;
      return user;
    }

    return null;
  }

  async login(user: User): Promise<TokensResponse> {
    const tokens = await this.getTokens(user);
    return tokens;
  }

  async refreshToken(user: User): Promise<TokensResponse> {
    const tokens = await this.getTokens(user);
    return tokens;
  }

  async getTokens(user: User): Promise<TokensResponse> {
    const payload: JwtPayload = { authUid: user.authUid };

    const accessToken = this.jwtService.signAsync(payload, {
      secret: this.appConfiguration.app.accessTokenSecret,
      expiresIn: this.appConfiguration.app.accessTokenExpiration,
    });

    const refreshToken = this.jwtService.signAsync(payload, {
      secret: this.appConfiguration.app.refreshTokenSecret,
      expiresIn: this.appConfiguration.app.refreshTokenExpiration,
    });

    try {
      const [access_token, refresh_token] = await Promise.all([
        accessToken,
        refreshToken,
      ]);

      return {
        access_token,
        refresh_token,
      };
    } catch (error) {
      Logger.error(error, AuthService.name);
      throw new ConflictException(
        'something went wrong when generating the tokens.',
      );
    }
  }
}
