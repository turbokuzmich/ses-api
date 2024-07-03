import { z } from 'zod';

export const signupSchema = z
  .object({
    login: z.string().email(),
    password: z.string(),
    nickname: z.string(),
  })
  .required();

export type SignupDto = z.infer<typeof signupSchema>;
