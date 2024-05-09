import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../auth/events/user-created.event';

@Injectable()
export class EmailService {

  @OnEvent('user.created')
  sendUserCreatedEmail(userCreatedEvent: UserCreatedEvent){
    console.log('User created event received', userCreatedEvent)
    // send an email
  }


}
