import { buildQueryString } from './build-query-string';

describe('helpers/build-query-string', () => {
    it('builds query string', () => {
        expect(
            buildQueryString({
                key1: 'val',
                key2: 3,
                key3: null,
                key4: undefined,
            }),
        ).toBe('?key1=val&key2=3&key3=null');
    });

    it('returns empty for empty objects', () => {
        expect(buildQueryString({})).toBe('');
    });
});
