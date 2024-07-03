import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User, Subscription } from './models';
import { AuthModule } from '../auth/auth.module';
import { UsersService } from './users.service';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [SequelizeModule.forFeature([User, Subscription]), AuthModule],
  exports: [UsersService],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UsersController);
  }
}
