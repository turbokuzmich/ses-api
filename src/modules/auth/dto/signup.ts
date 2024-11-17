import { Role } from 'src/modules/acl/types';
import { z } from 'zod';

export const signupSchema = z
  .object({
    login: z.string().email(),
    password: z.string(),
    nickname: z.string(),
    role: z.nativeEnum(Role),
  })
  .required();

export type SignupDto = z.infer<typeof signupSchema>;
