import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, AfterUpdate,JoinTable,ManyToMany } from 'typeorm';
import { Role } from '../../roles/entity/role.entity';
import { IsOptional } from 'class-validator';


@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  name: string;
  //marking the email as unique
  @Column({ unique: true })
  email: string;
  @Column()
  password: string;
  @Column({ default: true })
  active: boolean;
  @Column()
  createdAt: Date;

  @ManyToMany(() => Role)
  @JoinTable()
  roles: Role[];



  @BeforeInsert()
  logInsert() {
    this.createdAt = new Date();
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated User with id', this.id);
  }
}
