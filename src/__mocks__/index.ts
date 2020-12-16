/**
 * These mocks are used when we run our application in mock mode
 */
const data =
    process.env.MOCK === 'on'
        ? {

          }
        : {};

export const MOCKS = {
    Int: () => 7,
    Float: () => 7.77,
    String: () => 'AH hello world',
    Query: () => ({
        crocodile: (_: any, { id }: any) => {
            return null;
        },
        crocodiles: (_: any, { id }: any) => {
            return null;
        },
    }),
    Mutation: () => ({}),
};
