import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    ARCJET_KEY: z.string().startsWith('aj'),
    CORS_ORIGIN: z.enum(['*', 'https://credpal.com', 'http://localhost:3000']).default('http://localhost:3000'),
    MONGO_URI: z.string().min(1, 'MONGO_URI is required'),
    ACCESS_TOKEN_SECRET: z.string().min(1, 'ACCESS_TOKEN_SECRET is required'),    
    REFRESH_TOKEN_SECRET: z.string().min(1, 'REFRESH_TOKEN_SECRET is required'),
    ACCESS_TOKEN_EXPIRES_IN: z.string().default('15m'),
    REFRESH_TOKEN_EXPIRES_IN: z.string().default('7d'),
});

export const env = envSchema.parse(process.env);