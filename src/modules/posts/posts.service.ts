import { Injectable } from '@nestjs/common';
import { CreatePost } from './dto/post';
import DbService from '../db/db.service';
import { User } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private readonly db: DbService) {}

  createPost(user: User, post: CreatePost) {
    return this.db.post.create({
      data: {
        ...post,
        userId: user.id,
      },
    });
  }

  getByUser(id: number) {
    return this.db.post.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
