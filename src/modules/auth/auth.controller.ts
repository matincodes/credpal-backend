import type { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import * as authService from './auth.service.js';
import { generateTokenPair } from '../../services/token.services.js';
import { setAuthCookies, clearAuthCookies } from '../../utils/cookie.js';
import { AppError } from '../../utils/appError.js';
import type { IUser } from '../users/users.interface.js';
import { de } from 'zod/locales';

// 1. REGISTER
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await authService.registerUser(req.body);
    
    // Auto-login after register
    const tokens = generateTokenPair(user);
    setAuthCookies(res, tokens);

    // Remove password from response
    const userResponse = user.toObject();

    delete userResponse.password;

    res.status(201).json({
      success: true,
      data: { user: userResponse },
    });
  } catch (error) {
    next(error);
  }
};

// 2. LOGIN (Using Passport Local)
export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err: any, user: IUser, info: any) => {
    if (err) return next(err);
    
    if (!user) {
      return next(new AppError(info?.message || 'Invalid credentials', 401));
    }

    // Generate Tokens
    const tokens = generateTokenPair(user);
    setAuthCookies(res, tokens);

    // Remove password from response
    const userResponse = user.toObject();

    delete userResponse.password

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: userResponse },
    });
  })(req, res, next);
};

// 3. LOGOUT
export const logout = (req: Request, res: Response) => {
  clearAuthCookies(res);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// 4. REFRESH TOKEN
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return next(new AppError('No refresh token found', 401));
    }

    const newTokens = await authService.refreshUserToken(refreshToken);
    
    // Rotate tokens (Set new cookies)
    setAuthCookies(res, newTokens);

    res.status(200).json({ success: true, message: 'Token refreshed' });
  } catch (error) {
    // If refresh fails, force logout
    clearAuthCookies(res);
    next(error);
  }
};