import { User, type UserDocument } from './users.model.js';
import { AppError } from '../../utils/appError.js';
import type { UpdateProfileInput, ChangePasswordInput } from './users.validation.js';

/**
 * Get current user profile
 */
export const getUserById = async (userId: string) => {
  return await User.findById(userId);
};

/**
 * Update user profile (Name, Email)
 */
export const updateUserProfile = async (userId: string, data: UpdateProfileInput) => {
    // 1. Check if user exists and update
  const updatedUser = await User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new AppError('User not found', 404);
  }

  return updatedUser;
};

/**
 * Change Password
 */
export const changeUserPassword = async (userId: string, data: ChangePasswordInput) => {
  // 1. Get user explicitly selecting the password field (it's hidden by default)
  const user = await User.findById(userId).select('+password') as UserDocument;

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // 2. Check if current password is correct
  const isMatch = await user.verifyPassword(data.currentPassword);
  if (!isMatch) {
    throw new AppError('Incorrect current password', 401);
  }

  // 3. Update password
  // Assign it directly so the 'pre-save' hook we wrote earlier will run and hash it.
  user.password = data.newPassword;
  
  // 4. Save document (Triggers hashing)
  await user.save();

  return user;
};