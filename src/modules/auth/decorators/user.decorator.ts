import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/modules/users/models';

export const GetUser = createParamDecorator(
  (_: unknown, context: ExecutionContext): User | null => {
    return context.switchToHttp().getRequest<any>().user;
  },
);
