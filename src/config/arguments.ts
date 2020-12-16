import { Environment } from '@app/constants/environment';

const getRequiredEnvironmentVariable = (key: string): any => {
    const value = process.env[key];
    if (!value) {
        throw new Error(
            `No value present for environment variable key: ${key}`,
        );
    }
    return value;
};

const getOptionalEnvironmentVariable = (key: string): any => {
    const value = process.env[key];
    return value;
};

export interface ApplicationArguments {
    profile: Environment;
    logLevel: string;
    port: number;
    mock: string; // enum on/off
    proxy: string;
    apolloStudioKey: string | undefined;
    caching: string; // enum on/off
    playground: string; // enum on/off
    tracing: string; // enum on/off
    prometheus: string;
    production: string; // enum on/off
    memcache: string; // enum on/off
}

export const getApplicationArguments = (): ApplicationArguments => {
    return {
        profile: getRequiredEnvironmentVariable('PROFILE'),
        logLevel: getRequiredEnvironmentVariable('LOG_LEVEL'),
        port: getRequiredEnvironmentVariable('PORT'),
        mock: getRequiredEnvironmentVariable('MOCK'),
        apolloStudioKey: getOptionalEnvironmentVariable('APOLLO_KEY'),
        proxy: getOptionalEnvironmentVariable('PROXY'),
        caching: getRequiredEnvironmentVariable('CACHING'),
        playground: getRequiredEnvironmentVariable('PLAYGROUND'),
        tracing: getRequiredEnvironmentVariable('TRACING'),
        prometheus: getRequiredEnvironmentVariable('PROMETHEUS'),
        production: getRequiredEnvironmentVariable('PRODUCTION'),
        memcache: getRequiredEnvironmentVariable('MEMCACHE'),
    };
};
