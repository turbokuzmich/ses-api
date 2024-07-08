import { z } from 'zod';

export const meSchema = z.object({
  fio: z.string().optional().nullable().default(''),
  vk: z.string().optional().nullable().default(''),
  telegram: z.string().optional().nullable().default(''),
});

export type MeDto = z.infer<typeof meSchema>;
