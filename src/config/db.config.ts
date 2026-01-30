import mongoose from 'mongoose';
import { env } from './env.config.js';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // SENIOR TOUCH: Listen for connection errors AFTER initial connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;