import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// import { BullModule } from '@nestjs/bull';
// import { resolve } from 'path';
import { AuthMiddleware } from './auth.middleware';
import { DbModule } from '../db/db.module';
import { AclModule } from '../acl/acl.module';

@Module({
  imports: [
    DbModule,
    forwardRef(() => AclModule),
    // BullModule.registerQueue({
    //   name: 'authorization',
    //   processors: [resolve(__dirname, 'auth.processors.js')],
    // }),
  ],
  exports: [AuthService, AuthMiddleware],
  controllers: [AuthController],
  providers: [AuthService, AuthMiddleware],
})
export class AuthModule {}
