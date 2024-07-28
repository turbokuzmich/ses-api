import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, Subscription } from './models';
// import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private readonly userModel: typeof User,
    @InjectModel(Subscription)
    private readonly subscriptionModel: typeof Subscription,
  ) {}

  getById(id: number) {
    return this.userModel.findByPk(id);
  }

  getSubscription(targetUser: User, possibleFriendId: number) {
    return this.subscriptionModel.findOne({
      where: {
        userId: targetUser.id,
        friendId: possibleFriendId,
      },
    });
  }

  // @OnEvent('auth.signin')
  // async handleUserSignin(...args: any[]) {
  // console.log(args);
  // }

  // async listUsers() {
  //   const users = await this.userModel.findAll();

  //   return users;
  // }
}
