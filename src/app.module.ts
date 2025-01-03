import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import config, { Config } from './config';
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { BullModule } from '@nestjs/bull';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AclModule } from './modules/acl/acl.module';
import { HealthCheckModule } from './modules/healthcheck/healthcheck.module';
import { DbModule } from './modules/db/db.module';
import { MusicModule } from './modules/music/music.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config], isGlobal: true }),
    DbModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory(config: ConfigService<Config, true>) {
        return config.getOrThrow('redis', { infer: true });
      },
    }),
    AclModule,
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    PostsModule,
    HealthCheckModule,
    MusicModule,
  ],
})
export class AppModule {}
