import 'graphql-import-node';
import { createModule, gql } from 'graphql-modules';

import { mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';

const typeDefsArray = loadFilesSync(`${__dirname}/schema/*.graphql`, 
    { 
        useRequire: true,
    });
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
    /*
    typeDefs: gql`
        type Query {
            version: String!
        }

        directive @complexity(
            value: Int!
             multipliers: [String!]
        ) on FIELD_DEFINITION

        enum CacheControlScope {
            PRIVATE
            PUBLIC
        }

        directive @cacheControl(
            maxAge: Int
            scope: CacheControlScope
        ) on OBJECT | FIELD_DEFINITION | INTERFACE
    `,
    resolvers: {
        Query: {
            version: () => process.env.npm_package_version,
        },
    },
    */
});
