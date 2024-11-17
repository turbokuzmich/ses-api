import { Controller, Get, UseGuards } from '@nestjs/common';
import { AclService } from './acl.service';
import { AuthGuard } from '../auth/guards/auth';
import { GetUser } from '../auth/decorators/user.decorator';
import { type User } from '@prisma/client';

@Controller('acl')
export class AclController {
  constructor(private readonly service: AclService) {}

  @Get('roles')
  @UseGuards(AuthGuard)
  getUserRoles(@GetUser() user: User) {
    return this.service.getUserRoles(user.id);
  }
}
