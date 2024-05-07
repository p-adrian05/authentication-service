import { Module } from '@nestjs/common';
import { UserService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RolesModule } from '../roles/roles.module';
import { PasswordEncoder } from './service/password-encoder.service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),RolesModule],
  providers: [UserService,AuthService,
    {
      provide: PasswordEncoder,
      useValue: new PasswordEncoder({
        memorySize: 19456,
        iterations: 4,
        tagLength: 32,
        parallelism: 1,
        secret: null,
      })
    },
  ],
  controllers: [UsersController]
})
export class UsersModule {}
