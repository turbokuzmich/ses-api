import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import type { User } from '@prisma/client';
import { omit } from 'lodash';
// import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(private readonly db: DbService) {}

  serialize(user: User) {
    return omit(user, ['password']);
  }

  update(user: User, data: Partial<User>) {
    return this.db.user.update({
      where: {
        id: user.id,
      },
      data,
    });
  }

  getById(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }

  getSubscription(targetUser: User, possibleFriendId: number) {
    return this.db.subscription.findUnique({
      where: {
        userId_friendId: {
          userId: targetUser.id,
          friendId: possibleFriendId,
        },
      },
    });
  }

  async getSubscriptions(targetUser: User) {
    const subscriptions = await this.db.subscription.findMany({
      where: {
        userId: targetUser.id,
      },
      include: {
        subscriber: true,
      },
    });

    return subscriptions.map((subscription) => subscription.subscriber as User);
  }

  subscribe(targetUser: User, friendId: number) {
    return this.db.subscription.upsert({
      where: {
        userId_friendId: {
          userId: targetUser.id,
          friendId,
        },
      },
      update: {},
      create: {
        userId: targetUser.id,
        friendId,
      },
    });
  }

  unsubscribe(targetUser: User, friendId: number) {
    return this.db.subscription.delete({
      where: {
        userId_friendId: {
          userId: targetUser.id,
          friendId,
        },
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
