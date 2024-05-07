import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';


@Injectable()
export class RolesService {

  private DEFAULT_ROLE = 'user';

  constructor(@InjectRepository(Role) private repository: Repository<Role>) {
  }

  getDefaultRole():Promise<Role>{
    let roleEntity = this.repository.findOneBy({isDefault:true});
    if(!roleEntity){
      const role = this.repository.create({name:this.DEFAULT_ROLE,isDefault:true});
      roleEntity = this.repository.save(role);
    }
    return roleEntity;
  }
}
