import { builderFor } from '../../../../test/mocks/builder';

export const buildService = builderFor<any>({
    code: 'code',
    description: 'description',
    shortDescription: 'shortDescription',
});