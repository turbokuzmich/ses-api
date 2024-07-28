import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Post, UserWithPosts } from './models';
import { CreatePost } from './dto/post';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(UserWithPosts)
    private readonly userModel: typeof UserWithPosts,
    @InjectModel(Post) private readonly postModel: typeof Post,
  ) {}

  createPost(user: UserWithPosts, post: CreatePost) {
    return this.postModel.create({
      ...post,
      userId: user.id,
    });
  }

  getByUser(id: number) {
    return this.postModel.findAll({
      where: { userId: id },
      order: [['createdAt', 'DESC']],
    });
  }
}
