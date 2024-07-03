import { Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post, UserWithPosts } from '../models';
import { User } from 'src/modules/users/models';

@Injectable()
export class UserWithPostsPipe implements PipeTransform {
  constructor(
    @InjectModel(UserWithPosts)
    private userWithPostsModel: typeof UserWithPosts,
  ) {}

  async transform(value: User | null) {
    if (value === null) {
      return null;
    }

    const userWithPosts = new this.userWithPostsModel(
      {},
      { isNewRecord: false, raw: false },
    );

    userWithPosts.set(value.dataValues);
    await userWithPosts.reload({ include: [Post] });

    return userWithPosts;
  }
}
