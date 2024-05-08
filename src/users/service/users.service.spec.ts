
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserService } from './users.service';
import { Test, TestingModule } from '@nestjs/testing';
import { Role } from '../../roles/entity/role.entity';
import { RolesService } from '../../roles/service/roles.service';

describe('UsersService', () => {
  let service: UserService;
  let roleService: Partial<RolesService>;
  let repo: Repository<User>;
  const role:Role = {
    id: 1,
    name: 'User',
    isDefault: true
  }
  const user:User = {
    id: 1,
    email: 'user1@example.com',
    password: 'password1',
    active: true
  } as User;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: RolesService,
          useValue: {
            getDefaultRole: jest.fn()
          }
        },
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(user),
            save: jest.fn().mockImplementation((user:User) => Promise.resolve(user)),
            findOneBy: jest.fn().mockReturnValue(Promise.resolve(user)),
            createQueryBuilder:jest.fn().mockImplementation(() => ({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              getOne: jest.fn().mockResolvedValue(Object.assign(user, {roles:[role]})),
            }))
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
    roleService = module.get<RolesService>(RolesService);
  });

  it('creates a user', async () => {
    jest.spyOn(repo,'findOneBy').mockReturnValue(Promise.resolve(null));
    jest.spyOn(roleService,'getDefaultRole').mockReturnValue(Promise.resolve(role));

    const savedUser = await service.create(user.email, user.password);

    expect(savedUser.roles[0]).toEqual(role);
    expect(repo.findOneBy).toBeCalledWith({email: user.email});
    expect(roleService.getDefaultRole).toBeCalled();
    expect(repo.create).toBeCalledWith( { email: user.email, password: user.password });
    expect(repo.save).toBeCalled();
  });

  it('finds a user by id', async () => {
    const expectedUser = await service.findById(user.id);

    expect(expectedUser).toEqual(user);
    expect(expectedUser.roles).toEqual([role]);
    expect(repo.createQueryBuilder).toBeCalledWith('user');
  });

    it('should return a user by email', async () => {
      const email = 'user1@example.com';

      const result = await service.findByEmail(email);

      expect(repo.createQueryBuilder).toBeCalledWith('user');
      expect(result).toEqual(user);
      expect(result.roles).toEqual([role]);
    });

  it('returns null when id is not provided', async () => {
    expect(await service.findById(null)).toBeNull();
  });

  it('throws an error when user is already created with the same email', async () => {
    await expect(service.create(user.email, user.password)).rejects.toThrow( 'Email already in use');


    expect(repo.findOneBy).toBeCalledWith({ email: user.email });
  });

  it('finds a user by email', async () => {
    const expectedUser = await service.findByEmail(user.email);

    expect(expectedUser).toEqual(user);
    expect(repo.createQueryBuilder).toBeCalledWith('user');
  });
  it('updates a user', async () => {
    const attrs = { name: "adrian"};
    const expectedUser = await service.update(user.id, attrs);

    expect(expectedUser).toEqual(user);
    expect(repo.findOneBy).toBeCalledWith({ id: user.id });
    expect(repo.save).toBeCalledWith(Object.assign(user, attrs));
  });
  it('throws an error when updating a non-existing user', async () => {
    jest.spyOn(repo, 'findOneBy').mockReturnValue(Promise.resolve(null));
    const attrs = { name: "adrian" };

    await expect(service.update(user.id, attrs)).rejects.toThrow();

    expect(repo.findOneBy).toBeCalledWith({ id: user.id });
  });

  it('removes a user', async () => {
    const expectedUser = await service.remove(user.id);

    expect(expectedUser.active).toBeFalsy();
    expect(repo.findOneBy).toBeCalledWith({ id: user.id });
    expect(repo.save).toBeCalledWith(user);
  });


  it('throws an error when removing a non-existing user', async () => {
    jest.spyOn(repo, 'findOneBy').mockImplementation(() => Promise.resolve(null));

    await expect(service.remove(1)).rejects.toThrow();

    expect(repo.findOneBy).toBeCalledWith({ id: user.id });
  });
});