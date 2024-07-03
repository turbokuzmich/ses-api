import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.listUsers();
  }
}
