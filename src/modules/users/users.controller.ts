import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
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

  @Get(':id')
  async userById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getById(id);

    if (user) {
      return user.serialized;
    }

    throw new NotFoundException();
  }
}
