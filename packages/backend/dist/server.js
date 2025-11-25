"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = void 0;
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app_1 = require("./app");
const logger_1 = __importDefault(require("./utils/logger"));
const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';
const startServer = async () => {
    try {
        const app = await (0, app_1.createApp)();
        const server = app.listen(PORT, HOST, () => {
            logger_1.default.info(`Server running on http://${HOST}:${PORT}`);
            logger_1.default.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
        });
        const gracefulShutdown = (signal) => {
            logger_1.default.info(`Received ${signal}, shutting down gracefully`);
            server.close(() => {
                logger_1.default.info('HTTP server closed');
                process.exit(0);
            });
            setTimeout(() => {
                logger_1.default.error('Force shutdown after 10 seconds');
                process.exit(1);
            }, 10000);
        };
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        process.on('uncaughtException', (error) => {
            logger_1.default.error('Uncaught exception:', error);
            process.exit(1);
        });
        process.on('unhandledRejection', (reason, promise) => {
            logger_1.default.error('Unhandled rejection:', promise, 'reason:', reason);
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
};
exports.startServer = startServer;
if (require.main === module) {
    startServer();
}
//# sourceMappingURL=server.js.map