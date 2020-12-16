import { createModule } from 'graphql-modules';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const typeDefsArray = loadFilesSync(`${__dirname}/schema/*.graphql`);
const typeDefs = mergeTypeDefs(typeDefsArray, { useSchemaDefinition: false });

const resolverFunctions = {
    Query: {
        version: () => process.env.npm_package_version,
    },
};

export const CommonModule = createModule({
    id: 'common',
    typeDefs: typeDefs,
    resolvers: resolverFunctions,
});
