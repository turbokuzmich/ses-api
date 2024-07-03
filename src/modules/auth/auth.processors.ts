import { Job, DoneCallback } from 'bull';

export default function handle(job: Job<unknown>, done: DoneCallback) {
  // TODO отправлять почту
  done(null);
}
