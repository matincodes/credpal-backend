import type { Request, Response, NextFunction } from 'express';
import * as userService from './users.service.js';
import { AppError } from '../../utils/appError.js';

// 1. GET CURRENT USER
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // req.user is guaranteed to exist because of 'protect' middleware
    const user = req.user; 

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// 2. UPDATE PROFILE
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedUser = await userService.updateUserProfile(req.user!._id.toString(), req.body);

    res.status(200).json({
      success: true,
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// 3. CHANGE PASSWORD
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await userService.changeUserPassword(req.user!._id.toString(), req.body);

    // Optional: You might want to generate a new token here or just send success
    res.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    next(error);
  }
};