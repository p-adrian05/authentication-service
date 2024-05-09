import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserDto } from '../dto/user.dto';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UserService } from '../service/users.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../roles/dto/role.enum';
import { Routes } from '../../app.routes';

@Controller(Routes.USERS)
@Serialize(UserDto)
export class UsersController {


  constructor(private userService: UserService) {
  }

  @Get()
  @Roles(Role.User)
  getAllUser(){
    return this.userService.getAllUser();
  }
}
