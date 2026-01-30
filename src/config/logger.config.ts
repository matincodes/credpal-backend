import { createLogger, format, transports, type LoggerOptions } from 'winston';
import { env } from './env.config.js';

const { combine, timestamp, printf, colorize, align, json } = format;  

const logFormat = printf(({ level, message, label, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
});


// Configure Winston Logger
export const logger = createLogger({
    level: env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
    defaultMeta: { service: 'credpal-backend' },
    transports: [
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' }),
    ],
});


// If we're not in production then log to the `console` with the format:
if (env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: combine(colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), align(), logFormat),
    }));
}