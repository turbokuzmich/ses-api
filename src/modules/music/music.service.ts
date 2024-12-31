import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import { Music, User } from '@prisma/client';
import { UploadMusic } from './dto/music';
import { v4 as uuid } from 'uuid';
import { AclService } from '../acl/acl.service';
import { InjectQueue, OnQueueCompleted, Processor } from '@nestjs/bull';
import { Job, Queue } from 'bull';

@Injectable()
@Processor('audio')
export class MusicService {
  constructor(
    @InjectQueue('audio') private readonly audioQueue: Queue,
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

  async enqueueProcessMusic(music: Music) {
    const job = await this.audioQueue.add(music);

    return job.toJSON();
  }

  @OnQueueCompleted()
  private async onMusicProcessed(job: Job<Music>, result: any) {
    console.log(result);
  }
}
