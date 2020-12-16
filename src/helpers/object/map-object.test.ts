import { mapObject } from './map-object';

describe('helpers/object/map-object', () => {
    it('maps over object values', () => {
        const target = {
            key1: 1,
            key2: 2,
        };

        const result = mapObject(x => x + 1, target);

        expect(result).toEqual({
            key1: 2,
            key2: 3,
        });
    });
});
