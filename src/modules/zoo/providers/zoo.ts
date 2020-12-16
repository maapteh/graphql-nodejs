import { Injectable, Scope, ExecutionContext } from 'graphql-modules';
import {
    Crocodile, CrocodileResolvers,
} from '@app/generated/_graphql';
import { fetch, handleResponse } from '@app/helpers/fetch';
import { config } from '@app/config';
import { normalizeCrocodile, RawCrocodile } from '../normalizers/normalize-crocodile';

@Injectable({
    scope: Scope.Singleton,
})
export class ZooProvider {
    @ExecutionContext()
    // @ts-ignore
    private context: ExecutionContext;

    crocodile = async (id: number): Promise<Crocodile | null> => {

        const response = await fetch(
            this.context.token,
            `${config.service.zooService}/public/crocodiles/${id}/?format=json`,
            {
                method: 'GET',
            },
        );

        if (response.status !== 200) {
            return null;
        }

        const data = await handleResponse<RawCrocodile>(response);

        return data ? normalizeCrocodile(data) : null;
    };


    crocodiles = async (): Promise<Crocodile[] | null> => {

        const response = await fetch(
            this.context.token,
            `${config.service.zooService}/public/crocodiles/?format=json`,
            {
                method: 'GET',
            },
        );

        if (response.status !== 200) {
            return null;
        }

        const data = await handleResponse<RawCrocodile[]>(response);

        return data ? data.map(normalizeCrocodile) : null;
    };
}
