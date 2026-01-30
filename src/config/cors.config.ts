import type { CorsOptions } from 'cors';
import { env } from './env.config.js'

export const corsOptions: CorsOptions = {
    origin: (origin, callback) => {

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin){
            return callback(null, true);
        }

        // Allow requests with a specific origin
        if (env.CORS_ORIGIN === '*') {
            return callback(null, true);
        }

        // Allow requests with a specific origin
        if (env.CORS_ORIGIN === origin) {
            return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    optionsSuccessStatus: 200
}
