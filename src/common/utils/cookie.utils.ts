import { CookieOptions } from 'express';

import { SECRETS } from '../config/config';

export const getCookieOptions = (): CookieOptions => {
  return {
    httpOnly: true,
    secure: SECRETS.nodeEnv === 'production',
    sameSite: 'strict',
    maxAge: SECRETS.refreshTokenMaxAge,
  };
};
