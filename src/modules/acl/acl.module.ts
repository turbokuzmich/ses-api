import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AclService } from './acl.service';
import { User } from '../users/models';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  exports: [AclService],
  providers: [AclService],
})
export class AclModule {}
