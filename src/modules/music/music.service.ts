import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import { User } from '@prisma/client';
import { UploadMusic } from './dto/music';
import { v4 as uuid } from 'uuid';
import { AclService } from '../acl/acl.service';

// TODO check with file-type

@Injectable()
export class MusicService {
  constructor(
    private readonly db: DbService,
    private readonly acl: AclService,
  ) {}

  async initializeUpload(user: User, upload: UploadMusic) {
    const path = `${user.id}-${uuid()}`;

    const track = await this.db.music.create({
      data: {
        path,
        title: upload.title,
        description: upload.description,
        userId: user.id,
      },
    });

    await this.acl.setTrackOwner(track.id, user.id);

    return track;
  }
}
