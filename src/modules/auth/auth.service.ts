import { User } from '../users/users.model.js';
import type { RegisterInput } from './auth.validation.js';
import { AppError } from '../../utils/appError.js';
import { verifyRefreshToken, generateTokenPair } from '../../services/token.services.js';

/**
 * Registers a new user.
 */

export const registerUser = async (input: RegisterInput) => {
  // 1. Check if email exists
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new AppError('Email already in use', 409);
  }

  // 2. Create User 
  const newUser = await User.create(input);

  return newUser;
};

/**
 * Refresh Access Token using Refresh Token
 */

export const refreshUserToken = async (refreshToken: string) => {
  // 1. Verify the token signature
  const decoded = verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    throw new AppError('Invalid or expired refresh token', 401);
  }

  // 2. Check if user still exists
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new AppError('User belonging to this token no longer exists', 401);
  }

  // 3. Generate new pair
  return generateTokenPair(user);
};