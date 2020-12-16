import { Inject, Injectable, Scope, CONTEXT } from 'graphql-modules';
import DataLoader from 'dataloader';
import { fetch, handleResponse } from '@app/helpers/fetch';
import { config } from '@app/config';
import { normalizeCrocodile } from '../normalizers/normalize-crocodile';

@Injectable({
    scope: Scope.Operation,
})
export class ZooDataloader {
    constructor(
        @Inject(CONTEXT) private context: GraphQLModules.GlobalContext,
    ) {}

    private dataLoader = new DataLoader<number, unknown, unknown>(async keys => {
        const response = await fetch(
            this.context.token,
            `${config.service.zooService}/public/crocodiles/?format=json`,
        );

        const data = await handleResponse<any>(response);

        keys.map(key => null);
    });

    load(id: number) {
        return this.dataLoader.load(id);
    }
}
