import { z } from 'zod';

import { signInSchema, signUpSchema } from '../../common/validation/user.validation';

export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof signInSchema>;

export type RefreshTokenResult = {
  accessToken: string;
  refreshToken?: string;
};
export type SignUpResult = {
  accessToken: string;
  refreshToken: string;
};
export type LoginResult = {
  accessToken: string;
  refreshToken: string;
};
