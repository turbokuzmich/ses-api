import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { AclService } from '../acl.service';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles';
import { Type } from '../types';

@Injectable()
export class AclGuard implements CanActivate {
  constructor(
    private readonly aclService: AclService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest<Request>();

    const user = (request as any).user;
    if (!user) {
      return false;
    }

    const id = user.id;
    if (typeof id !== 'number') {
      return false;
    }

    const roles = this.reflector.get(Roles, context.getHandler());
    if (!roles) {
      return true;
    }

    const [entity, relation] = roles;

    return this.aclService.check(Type.User, id, relation, Type.Entity, entity);
  }
}
