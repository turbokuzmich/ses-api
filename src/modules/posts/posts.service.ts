import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post, UserWithPosts } from './models';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(UserWithPosts)
    private readonly userModel: typeof UserWithPosts,
    @InjectModel(Post) private readonly postModel: typeof Post,
  ) {}
}
