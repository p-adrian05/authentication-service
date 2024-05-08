import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/service/users.service';
import { Argon2Id } from './password-encoder.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {

  constructor(private usersService: UserService,
              private passwordEncoder: Argon2Id,
              private jwtService: JwtService) {
  }

  async signUp(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    const hash = await this.passwordEncoder.hash(password);
    return this.usersService.create(email, hash);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`Bad password or email!`);
    }
    const storedHash = user.password;
    const isPasswordValid = await this.passwordEncoder.verify(storedHash, password);
    if (isPasswordValid) {
      const payload = { sub: user.id};

      return this.jwtService.signAsync(payload);
    } else {
      throw new UnauthorizedException('Bad password or email');
    }
  }

}