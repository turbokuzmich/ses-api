import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post, UserWithPosts } from './models';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(UserWithPosts) private userModel: typeof UserWithPosts,
    @InjectModel(Post) private postModel: typeof Post,
  ) {}
}
