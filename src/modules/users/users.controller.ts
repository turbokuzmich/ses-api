import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from './models';
import { ZodValidationPipe } from 'src/pipes/zod';
import { MeDto, meSchema } from './dto/me';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@GetUser() user: User) {
    return user.serialized;
  }

  @Post('me')
  @UseGuards(AuthGuard)
  async updateMe(
    @Body(new ZodValidationPipe(meSchema)) me: MeDto,
    @GetUser() user: User,
  ) {
    return (await user.update(me)).serialized;
  }
}
