import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'warn';

export const logger = pino({
    prettyPrint: process.env.NODE_ENV === 'development',
    level: logLevel,
});
