import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest<Request>();

    return Boolean((request as any).user);
  }
}
