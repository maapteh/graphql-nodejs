import { AuthenticationError } from 'apollo-server-express';
import nodeFetch, { Response, RequestInit } from 'node-fetch';
import AbortController from 'abort-controller';
import { logger } from '../logger';
import { GenericError } from '@app/constants/error';
import { HttpHeaderKey } from '@app/constants/http';
import { ServiceError } from '../error/service-error';
import { ERROR } from '../error/error';

export const fetch = async (
    token: string | undefined,
    url: string,
    requestOptions?: Partial<RequestInit>,
    options?: { timeOut: number },
): Promise<Response> => {
    if (!token) {
        throw new AuthenticationError(GenericError.UNAUTHORIZED);
    }
    const controller = new AbortController();

    const defaultFetchOptions = {
        method: 'GET',
        signal: controller.signal,
        headers: {
            [HttpHeaderKey.ContentType]: 'application/json',
        },
    };

    const timeout = setTimeout(() => {
        logger.debug(
            {
                url,
                ...init,
            },
            'Request Timeout',
        );
        controller.abort();
    }, options?.timeOut ?? 5000);

    const init = !requestOptions
        ? defaultFetchOptions
        : {
              ...defaultFetchOptions,
              ...requestOptions,
              headers: {
                  ...defaultFetchOptions.headers,
                  ...requestOptions.headers,
              },
          };

    logger.debug(
        {
            url,
            ...init,
        },
        'Outgoing HTTP Request',
    );

    try {
        return await nodeFetch(url, init);
    } catch (err) {
        logger.error(err, 'Fetch Error');
        throw new ServiceError(ERROR.UPSTREAM);
    } finally {
        clearTimeout(timeout);
    }
};
