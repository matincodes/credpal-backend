import { env } from "./config/env.config.js";
import app from "./app.js";
import { logger } from "./config/logger.config.js";
import mongoose from "mongoose";
import { startReminderJob } from "./modules/notifications/notifications.scheduler.js";


// 1. Database Connection Function
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI);
        logger.info(`MongoDB Connected: ${conn.connection.host}`);
        
        // Listen for errors after initial connection
        mongoose.connection.on('error', (err) => {
            logger.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB disconnected. Attempting to reconnect...');
        });

    } catch (error: any) {
        logger.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};

// 2. Start Server Workflow
const startServer = async () => {
    // A. Connect to DB
    await connectDB();

    // B. Start Background Jobs (Scheduler)
    // Only start if DB is ready
    startReminderJob();
    logger.info('✅ Reminder Scheduler initialized');

    // C. Start Express Server
    const server = app.listen(env.PORT, () => {
        logger.info(`🚀 Server is running on port ${env.PORT}`);
        logger.info(`🌍 Environment: ${env.NODE_ENV}`);
        logger.info(`📄 Swagger Docs: http://localhost:${env.PORT}/api-docs`);
    });

    // 3. Graceful Shutdown & Error Handling
    
    // Handle Unhandled Promise Rejections (e.g. DB connection fail)
    process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
        logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason.message}`);
        server.close(() => {
            process.exit(1);
        });
    });

    // Handle Uncaught Exceptions (Sync errors)
    process.on('uncaughtException', (error: Error) => {
        logger.error(`Uncaught Exception: ${error.message}`);
        server.close(() => {
            process.exit(1);
        });
    });

    // Handle SIGTERM (Docker/Kubernetes shutdown signal)
    process.on('SIGTERM', () => {
        logger.info('👋 SIGTERM RECEIVED. Shutting down gracefully');
        server.close(() => {
            logger.info('💥 Process terminated');
            mongoose.connection.close(false);
        });
    });
};

startServer();