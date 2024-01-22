import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import appConfig from './config/app.config';
import appConfigSchema from './config/app.schema.config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CommonModule } from './common/common.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CalorieModule } from './modules/calorie/calorie.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validationSchema: appConfigSchema,
    }),

    TypeOrmModule.forRootAsync({
      inject: [appConfig.KEY],
      useFactory: (configService: ConfigType<typeof appConfig>) => {
        return {
          type: 'postgres',
          ssl:
            configService.environment === 'production'
              ? { rejectUnauthorized: false, sslmode: 'require' }
              : false,
          host: configService.database.host,
          port: configService.database.port,
          username: configService.database.user,
          password: configService.database.password,
          database: configService.database.database,
          autoLoadEntities: true,
          synchronize: configService.environment !== 'production',
          logging: configService.database.log === 'yes',
        };
      },
    }),

    CommonModule,
    UserModule,
    AuthModule,
    CalorieModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
