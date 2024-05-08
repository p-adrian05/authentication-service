import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { Role as RoleEnum } from '../dto/role.enum';


@Injectable()
export class RolesService {

  private DEFAULT_ROLE = RoleEnum.User;

  constructor(@InjectRepository(Role) private repository: Repository<Role>) {
  }

  async getDefaultRole():Promise<Role>{
    let roleEntity = await this.repository.findOneBy({isDefault:true});
    if(!roleEntity){
      const role = this.repository.create({name:this.DEFAULT_ROLE,isDefault:true});
      roleEntity = await this.repository.save(role);
    }
    return roleEntity;
  }
}
