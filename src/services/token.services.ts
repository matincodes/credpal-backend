import jwt from 'jsonwebtoken';
import type { IUser } from '../modules/users/users.interface.js';
import type { TokenPayload } from '../types/token.types.js';
import { env } from '../config/env.config.js';

/**
 * Generates a pair of access and refresh tokens.
 */
export function generateTokenPair(user: Pick<IUser, '_id' | 'email' | 'role'>) {
  // Safeguard: Ensure ID exists
  if (!user._id) {
    throw new Error('User ID is missing from token payload');
  }

  const payload: TokenPayload = {
    id: user._id.toString(), 
    email: user.email,
    role: user.role,
  };


  // Generate Access and Refresh Tokens
  const accessToken = jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
    expiresIn: env.ACCESS_TOKEN_EXPIRES_IN as any || '15m',
  });

  const refreshToken = jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
    expiresIn: env.REFRESH_TOKEN_EXPIRES_IN as any || '7d',
  });

  return { accessToken, refreshToken };
}

/**
 * Verifies a refresh token and returns the payload.
 */
export function verifyRefreshToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, env.REFRESH_TOKEN_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}