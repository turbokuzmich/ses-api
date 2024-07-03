import { Injectable, NestMiddleware } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { isSome } from 'fp-ts/lib/Option';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private authService: AuthService) {}

  async use(req: Request, _: Response, next: (error?: any) => void) {
    const user = await this.authService.getUserFromRequest(req);

    if (isSome(user)) {
      (req as any).user = user.value;
    } else {
      (req as any).user = null;
    }

    next();
  }
}
