import { UserService } from '../../users/service/users.service';
import { User } from '../../users/entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { Argon2Id } from './password-encoder.service';
import { AuthService } from './auth.service';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('UsersService', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let passwordEncoder: Argon2Id;
  let jwtService: JwtService;
  let eventEmitter: EventEmitter2;

  const user:User = {
    id: 1,
    email: 'user1@example.com',
    password: 'password1',
    active: true
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn().mockReturnValue(user)
          }
        },
        {
          provide: Argon2Id,
          useValue: {
            hash: jest.fn(),
            verify: jest.fn()
          }
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn()
          }
        },
        {
          provide: EventEmitter2,
          useValue: {
            emit: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    passwordEncoder = module.get<Argon2Id>(Argon2Id);
    jwtService = module.get<JwtService>(JwtService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should sign up a new user', async () => {
    const email = 'newuser@example.com';
    const password = 'password1';
    const user = { id: 2, email, password: 'hashedPassword', name: 'New User'};

    userService.findByEmail = jest.fn().mockResolvedValue(null);
    passwordEncoder.hash = jest.fn().mockResolvedValue('hashedPassword');
    userService.create = jest.fn().mockResolvedValue(user);

    const result = await service.signUp(email, password);

    expect(userService.findByEmail).toBeCalledWith(email);
    expect(passwordEncoder.hash).toBeCalledWith(password);
    expect(userService.create).toBeCalledWith(email, 'hashedPassword');
    expect(eventEmitter.emit).toBeCalledWith('user.created', { id: user.id, email,  name: user.name});
    expect(result).toEqual( user);
  });

  it('should throw an error when signing up with an existing email', async () => {
    const email = 'user1@example.com';
    const password = 'password1';

    userService.findByEmail = jest.fn().mockResolvedValue(user);

    await expect(service.signUp(email, password)).rejects.toThrow(BadRequestException);
  });

  it('should sign in an existing user with correct password', async () => {
    const email = 'user1@example.com';
    const password = 'password1';
    const token = 'token';

    userService.findByEmail = jest.fn().mockResolvedValue(user);
    passwordEncoder.verify = jest.fn().mockResolvedValue(true);
    jwtService.signAsync = jest.fn().mockResolvedValue(token);

    const result = await service.signIn(email, password);

    expect(userService.findByEmail).toBeCalledWith(email);
    expect(passwordEncoder.verify).toBeCalledWith(user.password, password);
    expect(jwtService.signAsync).toBeCalledWith({ sub: user.id });
    expect(result).toEqual(token);
  });

  it('should throw an error when signing in with incorrect password', async () => {
    const email = 'user1@example.com';
    const password = 'wrongPassword';

    userService.findByEmail = jest.fn().mockResolvedValue(user);
    passwordEncoder.verify = jest.fn().mockResolvedValue(false);

    await expect(service.signIn(email, password)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw an error when signing in with non-existing email', async () => {
    const email = 'nonexistent@example.com';
    const password = 'password1';

    userService.findByEmail = jest.fn().mockResolvedValue(null);

    await expect(service.signIn(email, password)).rejects.toThrow(UnauthorizedException);
  });
});