import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  async getUsers() {
    return await this.usersService.listUsers();
  }
}
