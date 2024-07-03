import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './modules/users/users.module';
import { User, Subscription } from './modules/users/models';
import { Post, UserWithPosts } from './modules/posts/models';
import config from './config';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
// import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AclModule } from './modules/acl/acl.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    SequelizeModule.forRootAsync({
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
        const db = await Promise.resolve(config.get('db'));
        return { ...db, models: [User, UserWithPosts, Subscription, Post] };
      },
    }),
    // BullModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory(config: ConfigService) {
    //     return {
    //       redis: config.get('redis'),
    //     };
    //   },
    // }),
    AclModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    PostsModule,
  ],
})
export class AppModule {}
