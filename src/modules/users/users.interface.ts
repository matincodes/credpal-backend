import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string; 
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;

  // Method to check password (useful if you keep logic in the model)
  verifyPassword(candidatePassword: string): Promise<boolean>;
}