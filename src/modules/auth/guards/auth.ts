import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest<Request>();
    const isAuthorized = Boolean((request as any).user);

    if (isAuthorized) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
