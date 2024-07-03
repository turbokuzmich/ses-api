import { Controller, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth';
import { GetUser } from '../auth/decorators/user.decorator';
import { UserWithPosts } from './models';
import { UserWithPostsPipe } from './pipes/user.with.posts.pipe';

@Controller('posts')
@UseGuards(AuthGuard)
export class PostsController {
  @Get('my')
  getMyPosts(@GetUser(UserWithPostsPipe) user: UserWithPosts | null) {
    return user?.posts ?? [];
  }
}
