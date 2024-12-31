import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MusicService } from './music.service';
import { GetUser } from '../auth/decorators/user.decorator';
import { Music, User } from '@prisma/client';
import { ZodValidationPipe } from 'src/pipes/zod';
import { type UploadMusic, uploadMusicSchema } from './dto/music';
import { AclGuard } from '../acl/guards/acl';
import { Roles } from '../acl/decorators/roles';
import { Entity, EntityRelation, Relation, Type } from '../acl/types';
import { AuthGuard } from '../auth/guards/auth';
import { MusicById } from './pipes/music';
import { AclService } from '../acl/acl.service';

@Controller('music')
export class MusicController {
  constructor(
    private readonly musicService: MusicService,
    private readonly aclService: AclService,
  ) {}

  @Post('my/upload')
  @Roles([Entity.Music, EntityRelation.Editor])
  @UseGuards(AclGuard)
  @HttpCode(200)
  upload(
    @GetUser() user: User,
    @Body(new ZodValidationPipe(uploadMusicSchema)) upload: UploadMusic,
  ) {
    return this.musicService.initializeUpload(user, upload);
  }

  @Post('my/process/:trackId')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async process(
    @GetUser() user: User,
    @Param('trackId', ParseIntPipe, MusicById) music: Music,
  ) {
    const isOwner = await this.aclService.check(
      Type.User,
      user.id,
      Relation[Type.Track].Owner,
      Type.Track,
      music.id,
    );

    if (isOwner) {
      return this.musicService.enqueueProcessMusic(music);
    }

    throw new ForbiddenException('You are not allowed to edit track');
  }
}
