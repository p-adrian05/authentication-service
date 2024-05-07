import { Body, Controller, Injectable, Post } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from '../service/auth.service';
import { UserService } from '../service/users.service';

@Controller('users')
export class UsersController {


  constructor(private authService: AuthService) {
  }


  @Post("/signup")
  async signUp(@Body() body: CreateUserDto) {
    const user = await this.authService.signUp(body.email, body.password);
    return user;
  }

}
