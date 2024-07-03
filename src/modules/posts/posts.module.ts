import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Post, UserWithPosts } from './models';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [SequelizeModule.forFeature([Post, UserWithPosts]), AuthModule],
  exports: [PostsService],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostsController);
  }
}
