import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthUserDto } from '../dto/auth-user.dto';
import { AuthService } from '../service/auth.service';
import { Public } from '../decorators/public.decorator';


@Controller('auth')
export class AuthController {


  constructor(private authService: AuthService) {
  }

  @HttpCode(HttpStatus.CREATED)
  @Post("/register")
  @Public()
  signUp(@Body() body: AuthUserDto) {
    return this.authService.signUp(body.email, body.password);
  }
  @HttpCode(HttpStatus.OK)
  @Post("/login")
  @Public()
  signIn(@Body() body: AuthUserDto) {
    return this.authService.signIn(body.email, body.password);
  }
}
