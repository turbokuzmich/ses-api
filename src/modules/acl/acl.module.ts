import { Module } from '@nestjs/common';
import { AclService } from './acl.service';
import { AclController } from './acl.controller';
import { AuthModule } from '../auth/auth.module';
import { MiddlewareConsumer } from '@nestjs/common';
import { AuthMiddleware } from '../auth/auth.middleware';

@Module({
  imports: [AuthModule],
  exports: [AclService],
  controllers: [AclController],
  providers: [AclService],
})
export class AclModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(AclController);
  }
}
