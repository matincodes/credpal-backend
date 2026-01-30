import type { Request } from 'express';

/**
 * Custom extractor for Passport-JWT
 * Looks for the token in req.cookies.accessToken
 */
export const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['accessToken'];
  }
  return token;
};