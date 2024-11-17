import { Injectable, PipeTransform } from '@nestjs/common';
import type { User, Post } from '@prisma/client';
import DbService from 'src/modules/db/db.service';

export type UserWithPosts = User & { posts: Post[] };

@Injectable()
export class UserWithPostsPipe implements PipeTransform {
  constructor(private readonly db: DbService) {}

  async transform(value: User | null): Promise<UserWithPosts | null> {
    if (value === null) {
      return null;
    }

    return this.db.user.findUnique({
      where: { id: value.id },
      include: {
        posts: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}
