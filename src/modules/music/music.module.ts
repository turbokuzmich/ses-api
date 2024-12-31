import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DbModule } from '../db/db.module';
import { MusicService } from './music.service';
import { MusicController } from './music.controller';
import { AuthMiddleware } from '../auth/auth.middleware';
import { AclModule } from '../acl/acl.module';
import { BullModule } from '@nestjs/bull';
import { resolve } from 'path';

@Module({
  imports: [
    AuthModule,
    AclModule,
    DbModule,
    BullModule.registerQueue({
      name: 'audio',
      processors: [resolve(__dirname, 'music.processor.js')],
    }),
  ],
  exports: [MusicService],
  providers: [MusicService],
  controllers: [MusicController],
})
export class MusicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MusicController);
  }
}
