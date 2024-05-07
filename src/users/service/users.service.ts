import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from '../../roles/service/roles.service';
import { UpdateUserDto } from '../update-user.dto';




@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private repository: Repository<User>,private rolesService: RolesService) {
  }

  async create(email: string, password: string): Promise<User> {
    const existingUser = await  this.repository.findOneBy({ email });
    if (existingUser) {
      throw new NotFoundException('Email already in use');
    }
    const user = this.repository.create({ email, password });
    const defaultRole = await this.rolesService.getDefaultRole();
    user.roles = [defaultRole];

    return this.repository.save(user);
  }

  findById(id: number): Promise<User> {
    if (!id) {
      return null;
    }
    return this.repository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User> {
    return this.repository.findOneBy({ email });
  }

  async update(id: number, attrs:UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');
    user.name = attrs.name;
    return this.repository.save(user);
  }

  async remove(id: number): Promise<User> {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException('User not found');

    user.active = false;
    return this.repository.save(user);
  }

}
