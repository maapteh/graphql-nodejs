if (process.env.NODE_ENV === 'production') {
    // support @app imports when running directly from dist folder
    require('module-alias/register');
}

import 'reflect-metadata';
import { AppModule } from './modules';
import { getApplicationArguments } from './config/arguments';
import { bootstrap } from './server';

bootstrap(AppModule, getApplicationArguments());
