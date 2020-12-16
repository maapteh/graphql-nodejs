import 'reflect-metadata';
import { createApplication } from 'graphql-modules';
import { parse } from 'graphql';
import { CommonModule } from '.';

describe('CommonModule', () => {
    it('has correct version query', async () => {
        const app = createApplication({
            modules: [CommonModule],
        });

        const createContext = () => ({ request: {}, response: {} });

        const document = parse(/* GraphQL */ `
            query {
                version
            }
        `);

        const result = await app.createExecution()({
            schema: app.schema,
            contextValue: createContext(),
            document,
        });

        expect(result.data?.version).toBeDefined();
    });
});
