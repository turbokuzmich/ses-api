import { type Music } from '@prisma/client';
import { Job, DoneCallback } from 'bull';

// TODO check with file-type

export default function handle(job: Job<Music>, done: DoneCallback) {
  done(null, 'It works');
}
