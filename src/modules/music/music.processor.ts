import { Job, DoneCallback } from 'bull';
import { join, dirname, basename } from 'path';
import { stat, unlink, rename } from 'fs/promises';
import { spawn } from 'child_process';
import { type AudioProcessingJobData } from './types';

async function fileExists(path: string) {
  try {
    const fileStat = await stat(path);

    return fileStat.isFile();
  } catch (_) {
    return false;
  }
}

async function convertWAV2MP3(filePath: string) {
  const { loadMusicMetadata } = await import('music-metadata');
  const { parseFile } = await loadMusicMetadata();

  const file = basename(filePath);
  const directory = dirname(filePath);
  const output = join(directory, `${file}.mp3`);

  function convert() {
    return new Promise((resolve, reject) => {
      const child = spawn('ffmpeg', [
        '-i',
        filePath,
        '-ar',
        '44100',
        '-ac',
        '2',
        '-b:a',
        '128k',
        '-y',
        output,
      ]);

      child.on('exit', (code) => {
        if (code) {
          reject();
        } else {
          resolve(undefined);
        }
      });

      child.on('error', () => {
        reject();
      });
    });
  }

  if (await fileExists(output)) {
    await unlink(output);
  }

  await convert();

  const meta = await parseFile(output);

  if (meta.format.container === 'MPEG') {
    await unlink(filePath);
    await rename(output, filePath);
  } else {
    await unlink(output);

    throw new Error('Failed to process file');
  }
}

export default async function handle(
  job: Job<AudioProcessingJobData>,
  done: DoneCallback,
) {
  try {
    const { loadMusicMetadata } = await import('music-metadata');
    const { parseFile } = await loadMusicMetadata();

    const filePath = join(job.data.uploadPath, job.data.music.path);

    if (!(await fileExists(filePath))) {
      return done(new Error('Not file'));
    }

    const {
      format: { container },
    } = await parseFile(filePath);

    if (!container || !['WAVE', 'MPEG'].includes(container)) {
      return done(new Error('Not audio file'));
    }

    if (container === 'WAVE') {
      await convertWAV2MP3(filePath);
    }

    done(null);
  } catch (error) {
    done(error as Error);
  }
}
