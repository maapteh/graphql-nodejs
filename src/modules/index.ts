import { createApplication } from 'graphql-modules';
import { CommonModule } from './common';
import { ZooModule } from './zoo';

export const AppModule = createApplication({
    modules: [
        CommonModule,
        ZooModule,
    ],
    // visitSchemaDirectives: true,
});
