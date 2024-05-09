import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthUserDto } from '../dto/auth-user.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../decorators/public.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../../users/entity/user.entity';
import { Serialize } from '../../interceptors/serialize.interceptor';
import { UserDto } from '../../users/dto/user.dto';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { Routes } from '../../app.routes';

@Controller(Routes.AUTH)
export class AuthController {

  constructor(private authService: AuthService) {
  }

  @HttpCode(HttpStatus.CREATED)
  @Post(Routes.AUTH_REGISTER)
  @Public()
  @Serialize(UserDto)
  signUp(@Body() body: AuthUserDto) {
    return this.authService.signUp(body.email, body.password);
  }
  @HttpCode(HttpStatus.OK)
  @Post(Routes.AUTH_LOGIN)
  @Public()
  async signIn(@Body() body: AuthUserDto) {
    const token = await this.authService.signIn(body.email, body.password);
    const authToken = new AuthTokenDto();
    authToken.access_token = token;
    authToken.token_type = 'Bearer';
    authToken.scope = 'user';
    return authToken;
  }
  @Get(Routes.AUTH_ME)
  @Serialize(UserDto)
  async whoAmI(@CurrentUser() user:User){
    return user;
  }
}
