import { ServiceConfig, serviceConfig } from './service';
import { ServerConfig, serverConfig } from './server';
import { Environment } from '../constants/environment';

export interface Config {
    service: ServiceConfig;
    server: ServerConfig;
}

const envProfile = process.env.PROFILE;

const PROFILE = (envProfile as Environment) || Environment.PRODUCTION;

export const config: Config = {
    service: serviceConfig(PROFILE),
    server: serverConfig(PROFILE),
};
