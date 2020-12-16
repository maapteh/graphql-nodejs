import { Environment } from '../constants/environment';

// KEEP THIS LIST ON ALPHABET!!!
export interface ServiceConfig {
    zooService: string;
}

export const serviceConfig = (environment: Environment): ServiceConfig => {
    switch (environment) {
        case Environment.LOCAL: {
            return {
                zooService: 'https://test-api.loadimpact.com',
            };
        }
        case Environment.DEVELOPMENT:
        case Environment.TEST:
        case Environment.ACCEPTANCE:
        case Environment.PRODUCTION:
        default: {
            return {
                zooService: 'https://test-api.loadimpact.com',
            };
        }
    }
};
