import { createModule } from 'graphql-modules';
import { mergeResolvers, mergeTypeDefs } from '@graphql-tools/merge';
import { loadFilesSync } from '@graphql-tools/load-files';
import { ZooProvider } from './providers/zoo';
// import { ZooDataloader } from './providers/zoo.dataloader';

const resolversArray = loadFilesSync(`${__dirname}/resolvers`, {
    extensions: ['ts', 'js'],
});
const typeDefsArray = loadFilesSync(`${__dirname}/schema/*.graphql`);
const resolvers = mergeResolvers(resolversArray);
const typeDefs = mergeTypeDefs(typeDefsArray, { useSchemaDefinition: false });

export const ZooModule = createModule({
    id: 'zoo',
    providers: [
        ZooProvider,
        // ZooDataloader,
    ],
    resolvers: resolvers,
    typeDefs: typeDefs,
});
