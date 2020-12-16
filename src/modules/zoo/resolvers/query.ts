import { ZooProvider } from '../providers/zoo';

export const resolvers = {
    Query: {
        crocodile: async (_: any, { id }: any, { injector }: any) => {
            return injector.get(ZooProvider).crocodile(id);
        },

        crocodiles: async (
            _: any,
            __: any,
            { injector }: any,
        ) => {
            return injector.get(ZooProvider).crocodiles();
        },
    },
};
