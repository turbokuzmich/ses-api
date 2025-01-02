import { Music } from '@prisma/client';

export type AudioProcessingJobData = {
  uploadPath: string;
  music: Music;
};
