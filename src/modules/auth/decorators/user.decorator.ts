import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { User } from '@prisma/client';

export const GetUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User | null => {
    return context.switchToHttp().getRequest<any>().user;
  },
);
