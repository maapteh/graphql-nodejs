import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Response } from 'node-fetch';
import { ERROR } from '../error/error';
import { ServiceError } from '../error/service-error';

type HandleResponseOptions = {
    silentFailure?: boolean;
    throwOnError?: boolean;
};

const DEFAULT_HANDLE_RESPONSE_OPTIONS: HandleResponseOptions = {
    silentFailure: false,
    throwOnError: true,
};

export const validateResponse = async (
    response: Response,
): Promise<Error | undefined> => {
    let error = undefined;

    if (response.status === 400) {
        error = new UserInputError(ERROR.BAD_REQUEST);
    } else if (response.status === 401) {
        error = new AuthenticationError(ERROR.UNAUTHORIZED);
    } else if (response.status === 403) {
        error = new AuthenticationError(ERROR.FORBIDDEN);
    } else if (response.status === 409) {
        error = new UserInputError(ERROR.CONFLICT);
    } else if (response.status < 200 || response.status >= 300) {
        error = new ServiceError(
            ERROR.UPSTREAM,
            response.status,
            await response.text(),
        );
    }

    return error;
};

export const handleResponse = async <T>(
    response: Response,
    {
        silentFailure = false,
        throwOnError = true,
    }: HandleResponseOptions = DEFAULT_HANDLE_RESPONSE_OPTIONS,
): Promise<T | null> => {
    if (!response.ok) {
        if (silentFailure) {
            return null;
        }

        if (throwOnError) {
            const error = await validateResponse(response);

            if (error) {
                throw error;
            }
        }
    }

    const data = await response.json();
    return data ? data : null;
};
