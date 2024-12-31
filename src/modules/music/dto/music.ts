import { z } from 'zod';

export const uploadMusicSchema = z
  .object({
    title: z
      .string({ required_error: 'Укажите название' })
      .min(3, 'Название должно содержать хотя бы 3 символа'),
    description: z
      .string({ required_error: 'Укажите описание' })
      .min(3, 'Описание должно содержать хотя бы 3 символа'),
  })
  .required();
export type UploadMusic = z.infer<typeof uploadMusicSchema>;
