import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, Subscription } from './models';
// import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    @InjectModel(Subscription) private subscriptionModel: typeof Subscription,
  ) {
    // console.log(this.subscriptionModel);
  }

  // @OnEvent('auth.signin')
  // async handleUserSignin(...args: any[]) {
  // console.log(args);
  // }

  async listUsers() {
    const users = await this.userModel.findAll();

    return users;
  }
}
