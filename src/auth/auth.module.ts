import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UtilisateursModule } from '../utilisateurs/utilisateurs.module.js';
import { UtilisateursSessionsModule } from '../utilisateurs-sessions/utilisateurs-sessions.module.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { RefreshStrategy } from './strategies/refresh.strategy.js';
import { PassportModule } from '@nestjs/passport';
import { AdminSeedService } from './admin-seed.service.js';
import {MailerService} from './mailer.service.js'

@Module({
  imports: [
    PrismaModule,
    UtilisateursModule,
    ConfigModule,
    UtilisateursSessionsModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<number>('JWT_EXPIRES_IN')!
        }
      }),
    }),

  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    AdminSeedService,
    RefreshStrategy,
    MailerService,

    {
      provide: 'REFRESH_JWT_SERVICE',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtService({
          secret: configService.getOrThrow<string>(
            'JWT_REFRESH_SECRET',
          ),
          signOptions: {
            expiresIn: configService.getOrThrow(
              'JWT_REFRESH_EXPIRES_IN',
            ),
          },
        });
      },
    },
  ],

  
})
export class AuthModule {}
