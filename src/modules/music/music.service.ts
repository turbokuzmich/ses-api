import { Injectable } from '@nestjs/common';
import DbService from '../db/db.service';
import { Music, User } from '@prisma/client';
import { UploadMusic } from './dto/music';
import { v4 as uuid } from 'uuid';
import { AclService } from '../acl/acl.service';
import {
  InjectQueue,
  OnQueueActive,
  OnQueueCompleted,
  OnQueueFailed,
  Processor,
} from '@nestjs/bull';
import { Job, Queue } from 'bull';
import { ConfigService } from '@nestjs/config';
import { Config } from 'src/config';
import { type AudioProcessingJobData } from './types';

@Injectable()
@Processor('audio')
export class MusicService {
  constructor(
    @InjectQueue('audio')
    private readonly audioQueue: Queue<AudioProcessingJobData>,
    private readonly db: DbService,
    private readonly acl: AclService,
    private readonly config: ConfigService<Config, true>,
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

    await this.acl.setMusicOwner(track.id, user.id);

    return track;
  }

  async enqueueProcessMusic(music: Music) {
    const uploadPath = this.config.getOrThrow('uploadPath', { infer: true });

    await this.db.music.update({
      data: { status: 'UPLOADED' },
      where: { id: music.id },
    });

    const job = await this.audioQueue.add(
      { uploadPath, music },
      { removeOnFail: true, removeOnComplete: true },
    );

    return job.toJSON();
  }

  getMusicByUser(user: User) {
    return this.db.music.findMany({
      where: {
        userId: user.id,
      },
    });
  }

  @OnQueueActive()
  private async onMusicProcessing(job: Job<AudioProcessingJobData>) {
    await this.db.music.update({
      data: { status: 'PROCESSING' },
      where: { id: job.data.music.id },
    });
  }

  @OnQueueCompleted()
  private async onMusicProcessed(job: Job<AudioProcessingJobData>) {
    await this.db.music.update({
      data: { status: 'PROCESSED' },
      where: { id: job.data.music.id },
    });
  }

  @OnQueueFailed()
  private async onMusicFailed(job: Job<AudioProcessingJobData>, error?: Error) {
    await this.db.music.update({
      data: { status: 'ERROR', error: error?.message ?? 'Unknown error' },
      where: { id: job.data.music.id },
    });
  }
}
