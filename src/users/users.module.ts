import { Module } from '@nestjs/common';
import { UserService } from './service/users.service';
import { UsersController } from './controller/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]),RolesModule],
  exports: [UserService],
  providers: [UserService],
  controllers: [UsersController]
})
export class UsersModule {}
