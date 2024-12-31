import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { MusicService } from './music.service';
import { GetUser } from '../auth/decorators/user.decorator';
import { User } from '@prisma/client';
import { ZodValidationPipe } from 'src/pipes/zod';
import { type UploadMusic, uploadMusicSchema } from './dto/music';
import { AclGuard } from '../acl/guards/acl';
import { Roles } from '../acl/decorators/roles';
import { Entity, EntityRelation } from '../acl/types';

@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Post('my/upload')
  @Roles([Entity.Music, EntityRelation.Editor])
  @UseGuards(AclGuard)
  @HttpCode(200)
  async upload(
    @GetUser() user: User,
    @Body(new ZodValidationPipe(uploadMusicSchema)) upload: UploadMusic,
  ) {
    return this.musicService.initializeUpload(user, upload);
  }

  // FIXME check user is track owner on edit endpoint
}
