import nodeFetch from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import { ERROR } from '../error/error';
import { fetch } from './fetch';

jest.mock('node-fetch', () => {
    return jest.fn();
});

describe('helpers/fetch', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('throws on error without leaking information', async () => {
        mocked(nodeFetch).mockImplementation(() => {
            throw new Error('SENSITIVE INFORMATION');
        });

        try {
            await fetch('token', '');
            fail('should throw');
        } catch (err) {
            expect(err.message).toBe(ERROR.UPSTREAM);
            expect(err.extensions).toBeUndefined();
            expect(err.text).toBeUndefined();
        }
    });
});
