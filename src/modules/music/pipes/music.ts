import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { Music } from '@prisma/client';
import DbService from 'src/modules/db/db.service';

@Injectable()
export class MusicById implements PipeTransform {
  constructor(private readonly db: DbService) {}

  async transform(id: number): Promise<Music> {
    const music = await this.db.music.findUnique({
      where: { id },
    });

    if (music) {
      return music;
    }

    throw new NotFoundException('Music not found');
  }
}
