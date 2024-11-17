import {
  Controller,
  UseGuards,
  Get,
  Body,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth';
import { GetUser } from '../auth/decorators/user.decorator';
import {
  UserWithPostsPipe,
  type UserWithPosts,
} from './pipes/user.with.posts.pipe';
import { ZodValidationPipe } from 'src/pipes/zod';
import { type CreatePost, createPostSchema } from './dto/post';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('my')
  @UseGuards(AuthGuard)
  getMyPosts(@GetUser(UserWithPostsPipe) user: UserWithPosts | null) {
    return user?.posts ?? [];
  }

  @Post()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  createPost(
    @Body(new ZodValidationPipe(createPostSchema)) postData: CreatePost,
    @GetUser(UserWithPostsPipe) user: UserWithPosts,
  ) {
    return this.postsService.createPost(user, postData);
  }

  @Get('by-user/:id')
  getByUser(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.getByUser(id);
  }
}
