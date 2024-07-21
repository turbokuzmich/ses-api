import { z } from 'zod';

export const createPostSchema = z
  .object({
    text: z.string().min(1),
  })
  .required();

export type CreatePost = z.infer<typeof createPostSchema>;
