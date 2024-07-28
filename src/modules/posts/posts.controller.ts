import {
  Controller,
  UseGuards,
  Get,
  Put,
  Body,
  HttpCode,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth';
import { GetUser } from '../auth/decorators/user.decorator';
import { UserWithPosts } from './models';
import { UserWithPostsPipe } from './pipes/user.with.posts.pipe';
import { ZodValidationPipe } from 'src/pipes/zod';
import { type CreatePost, createPostSchema } from './dto/post';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('my')
  @UseGuards(AuthGuard)
  getMyPosts(@GetUser(UserWithPostsPipe) user: UserWithPosts | null) {
    return (user?.posts ?? []).map((post) => post.serialized);
  }

  @Put()
  @HttpCode(200)
  @UseGuards(AuthGuard)
  async createPost(
    @Body(new ZodValidationPipe(createPostSchema)) postData: CreatePost,
    @GetUser(UserWithPostsPipe) user: UserWithPosts,
  ) {
    const newPost = await this.postsService.createPost(user, postData);

    return newPost.serialized;
  }

  @Get('by-user/:id')
  async getByUser(@Param('id', ParseIntPipe) id: number) {
    const posts = await this.postsService.getByUser(id);

    return posts.map((post) => post.serialized);
  }
}
