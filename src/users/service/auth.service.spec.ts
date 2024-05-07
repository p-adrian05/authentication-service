import { UserService } from './users.service';
import { User } from '../entity/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordEncoder } from './password-encoder.service';
import { AuthService } from './auth.service';

describe('UsersService', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let passwordEncoder: PasswordEncoder;

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
          provide: PasswordEncoder,
          useValue: {
            hash: jest.fn(),
            verify: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    passwordEncoder = module.get<PasswordEncoder>(PasswordEncoder);
  });

  it('creates a user', async () => {

  });
});