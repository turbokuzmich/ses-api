import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/models';
// import { BullModule } from '@nestjs/bull';
// import { resolve } from 'path';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [
    SequelizeModule.forFeature([User]),
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
