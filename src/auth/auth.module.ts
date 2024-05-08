import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';

import { UsersModule } from '../users/users.module';
import { AuthService } from './service/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Argon2Id } from './service/password-encoder.service';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { Role } from '../roles/dto/role.enum';

@Module({
  imports: [UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<string>('JWT_EXPIRES_IN') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, {
    provide: Argon2Id,
    //m=19456 (19 MiB), t=2, p=1 (owasp recommended)
    useValue: new Argon2Id({
      memorySize: 19456,
      iterations: 2,
      parallelism: 1,
    }),
  },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    }
  ]
})
export class AuthModule {
}
