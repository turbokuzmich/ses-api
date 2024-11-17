import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../auth/auth.middleware';
import { DbModule } from '../db/db.module';

@Module({
  imports: [AuthModule, DbModule],
  exports: [PostsService],
  providers: [PostsService],
  controllers: [PostsController],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(PostsController);
  }
}
