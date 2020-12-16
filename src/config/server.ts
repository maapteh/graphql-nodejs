import { Environment } from '../constants/environment';

export interface ServerConfig {
    logErrors: boolean;
    redis: {
        host?: string;
        port?: string;
        name?: string;
        db?: number;
        sentinels?: { host?: string; port?: string }[];
        sentinelPassword?: string;
        password?: string;
    };
}

export const serverConfig = (environment: Environment): ServerConfig => {
    switch (environment) {
        case Environment.DEVELOPMENT:
        case Environment.LOCAL: {
            return {
                logErrors: true,
                redis: {
                    host: process.env.REDIS_HOST,
                    port: process.env.REDIS_PORT,
                    name: process.env.REDIS_NAME,
                    db: 0,
                },
            };
        }

        case Environment.TEST:
        case Environment.ACCEPTANCE:
        case Environment.PRODUCTION:
        default: {
            return {
                logErrors: false,
                redis: {
                    sentinels: [
                        {
                            host: process.env.REDIS_HOST,
                            port: process.env.REDIS_PORT,
                        },
                    ],
                    db: 0,
                    name: process.env.REDIS_NAME,
                    sentinelPassword: process.env.REDIS_PASSWORD,
                    password: process.env.REDIS_PASSWORD,
                },
            };
        }
    }
};
