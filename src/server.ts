import app from "./app.js";
import { env } from "./config/env.config.js";
import { logger } from "./config/logger.config.js";
import type { Server } from "http";


const server: Server = app.listen(env.PORT, () => {
    logger.info(`Server is running on port ${env.PORT}`);
    logger.info(`Environment: ${env.NODE_ENV}`);
});

process.on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason.message}`);
    server.close(() => {
        process.exit(1);
    });
});