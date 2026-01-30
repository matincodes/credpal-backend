import type { Response, CookieOptions } from 'express';
import type { TokenPair } from '../types/token.types.js';
import { env } from '../config/env.config.js';

const isProduction = env.NODE_ENV === 'production';

// Default defaults for cookie security
const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction, // Send only over HTTPS in prod
  sameSite: isProduction ? 'strict' : 'lax', // 'lax' helps with local dev redirect issues
  path: '/',
};

export const setAuthCookies = (res: Response, { accessToken, refreshToken }: TokenPair) => {
  // 1. Set Access Token (Short-lived)
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 30 * 60 * 1000, // 30 minutes in milliseconds
  });

  // 2. Set Refresh Token (Long-lived)
  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};