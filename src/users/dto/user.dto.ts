import { Expose, Transform } from 'class-transformer';
import { Role } from '../../roles/entity/role.entity';


export class UserDto{
  @Expose()
  id: number;
  @Expose()
  email: string;
  @Expose()
  name: string;
  @Expose()
  active: boolean;
  @Expose()
  createdAt: Date;
  @Expose()
  @Transform(({obj}) => obj.roles?.map((role:Role) => role.name))
  roles: string[];
}