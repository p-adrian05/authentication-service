import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";

import { promisify } from "util";
import { scrypt as _scrypt,randomBytes,timingSafeEqual } from "crypto";
import { UserService } from './users.service';
import { PasswordEncoder } from './password-encoder.service';

const scrypt = promisify(_scrypt);


@Injectable()
export class AuthService {

  constructor(private usersService:UserService,private passwordEncoder:PasswordEncoder) {}


  async signUp(email:string,password:string){
    const user = await this.usersService.findByEmail(email);

    const salt = randomBytes(16).toString('hex');
    const hash = await  this.passwordEncoder.hash(password)
    console.log(hash);
    return this.usersService.create(email,hash);
  }

  async signIn(email:string,password:string){
    const user = await this.usersService.findByEmail(email);
    if(!user){
      throw new NotFoundException(  `User with email ${email} not found`);
    }
    const [salt,storedHash] = user.password.split('.');

    const hash = await scrypt(password,salt,64) as Buffer;

    if(timingSafeEqual(hash,Buffer.from(storedHash,'hex'))){
      return user;
    }else{
      throw new BadRequestException('Bad password or email');
    }
  }


}