import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AclService } from './acl.service';
import { AuthGuard } from '../auth/guards/auth';
import { GetUser } from '../auth/decorators/user.decorator';
import { type User } from '@prisma/client';
import { Entity, EntityRelation, Type } from './types';
import { ZodValidationPipe } from 'src/pipes/zod';
import { nativeEnum } from 'zod';

@Controller('acl')
export class AclController {
  constructor(private readonly service: AclService) {}

  @Get('roles')
  @UseGuards(AuthGuard)
  getUserRoles(@GetUser() user: User) {
    return this.service.getUserRoles(user.id);
  }

  @Get('check-entity')
  @UseGuards(AuthGuard)
  async checkEntity(
    @GetUser() user: User,
    @Query('entity', new ZodValidationPipe(nativeEnum(Entity))) entity: Entity,
    @Query('relation', new ZodValidationPipe(nativeEnum(EntityRelation)))
    relation: EntityRelation,
  ) {
    const allowed = await this.service.check(
      Type.User,
      user.id,
      relation,
      Type.Entity,
      entity,
    );

    return { allowed };
  }
}
