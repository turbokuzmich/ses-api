import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  NotFoundException,
  Put,
  Delete,
} from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/user.decorator';
import { ZodValidationPipe } from 'src/pipes/zod';
import { MeDto, meSchema } from './dto/me';
import type { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@GetUser() user: User) {
    return this.usersService.serialize(user);
  }

  @Put('me')
  @UseGuards(AuthGuard)
  async updateMe(
    @Body(new ZodValidationPipe(meSchema)) me: MeDto,
    @GetUser() user: User,
  ) {
    return this.usersService
      .update(user, me)
      .then((user) => this.usersService.serialize(user));
  }

  @Get('subscriptions')
  @UseGuards(AuthGuard)
  async subscriptions(@GetUser() user: User) {
    const subscriptions = await this.usersService.getSubscriptions(user);

    return subscriptions.map((subscription) =>
      this.usersService.serialize(subscription),
    );
  }

  @Get('is-subscribed/:id')
  @UseGuards(AuthGuard)
  async amISubscribed(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const subscription = await this.usersService.getSubscription(user, id);

    return { subscribed: Boolean(subscription) };
  }

  @Post('subscribe/:id')
  @UseGuards(AuthGuard)
  async subscribe(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const subscription = await this.usersService.subscribe(user, id);

    return { subscribed: Boolean(subscription) };
  }

  @Delete('subscribe/:id')
  @UseGuards(AuthGuard)
  async unsubscribe(
    @GetUser() user: User,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.usersService.unsubscribe(user, id);

    return { subscribed: false };
  }

  @Get(':id')
  async userById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.getById(id);

    if (user) {
      return this.usersService.serialize(user);
    }

    throw new NotFoundException();
  }
}
