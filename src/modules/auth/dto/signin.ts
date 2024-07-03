import { z } from 'zod';

export const signinSchema = z
  .object({
    login: z.string().email(),
    password: z.string(),
  })
  .required();

export type SigninDto = z.infer<typeof signinSchema>;
