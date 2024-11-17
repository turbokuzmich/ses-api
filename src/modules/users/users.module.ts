import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { AuthMiddleware } from '../auth/auth.middleware';
import { DbModule } from '../db/db.module';

@Module({
  imports: [AuthModule, DbModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
