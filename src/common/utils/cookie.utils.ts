import { CookieOptions } from 'express';

import { SECRETS } from '../config/config';

export const getCookieOptions = (tokenType: 'access' | 'refresh'): CookieOptions => {
  const commonOptions: CookieOptions = {
    httpOnly: true,
    secure: SECRETS.nodeEnv === 'production',
    sameSite: 'strict',
  };

  if (tokenType === 'access') {
    return {
      ...commonOptions,
      maxAge: SECRETS.accessTokenMaxAge,
    };
  }

  return {
    ...commonOptions,
    maxAge: SECRETS.refreshTokenMaxAge,
  };
};
