import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../../users/service/users.service';
import { Argon2Id } from './password-encoder.service';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../events/user-created.event';


@Injectable()
export class AuthService {

  constructor(private usersService: UserService,
              private passwordEncoder: Argon2Id,
              private jwtService: JwtService,
              private eventEmitter: EventEmitter2) {
  }

  async signUp(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('Email already in use');
    }
    const hash = await this.passwordEncoder.hash(password);
    const createdUser = await this.usersService.create(email, hash);

    this.eventEmitter.emit('user.created',
      new UserCreatedEvent(createdUser.id, createdUser.email, createdUser.name));

    return createdUser;
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(`Bad password or email!`);
    }
    const storedHash = user.password;
    const isPasswordValid = await this.passwordEncoder.verify(storedHash, password);
    if (isPasswordValid) {
      const payload = { sub: user.id };

      return this.jwtService.signAsync(payload);
    } else {
      throw new UnauthorizedException('Bad password or email');
    }
  }

}