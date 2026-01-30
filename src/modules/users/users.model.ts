import { Schema, model, Model, Document } from 'mongoose';
import argon2 from 'argon2';
import type { IUser } from './users.interface.js';

// Define custom methods interface
export interface IUserMethods {
  verifyPassword(candidatePassword: string): Promise<boolean>;
}

// Define the Full Document Type
export type UserDocument = IUser & IUserMethods & Document;

// Define the Model Type
type UserModel = Model<IUser, {}, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>({
    name: { 
        type: String, 
        required: [true, 'Username is required'],
        trim: true,
        minLength: 2,
        maxLength: 50
    },
    email: { 
        type: String, 
        required: [true, 'User Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill valid email address'],
    },
    password: { 
        type: String,
        required: [true, 'User Password is required'],
        minLength: 6
    }
}, { timestamps: true });


// Pre-save Hook: HANDLES HASHING
userSchema.pre('save', async function() {
    // 'this' refers to the document being saved
    const user = this as UserDocument;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password') || !user.password) return;

    try {
        // Argon2 hashing
        user.password = await argon2.hash(user.password);
    
    } catch (err: any) {
        throw err;
    }
});

// Instance Method: HANDLES VERIFICATION
userSchema.methods.verifyPassword = async function(candidatePassword: string): Promise<boolean> {
    const user = this as UserDocument;

    if (!user.password) {
        return false;
    }
    
    // Argon2 verification
    return await argon2.verify(user.password, candidatePassword);
};

export const User = model<IUser, UserModel>('User', userSchema);