import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from './models';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@GetUser() user: User) {
    return user.serialized;
  }
}
