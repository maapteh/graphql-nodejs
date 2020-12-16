import { isEmpty } from './is-empty';

describe('helpers/is-empty', () => {
    it('null', () => {
        expect(isEmpty(null)).toBe(true);
    });
    it('undefined', () => {
        expect(isEmpty(undefined)).toBe(true);
    });

    it('number 0', () => {
        expect(isEmpty(0)).toBe(false);
    });
    it('number greater than 0', () => {
        expect(isEmpty(1)).toBe(false);
    });

    it('string empty', () => {
        expect(isEmpty('')).toBe(true);
    });
    it('string non-empty', () => {
        expect(isEmpty('a')).toBe(false);
    });

    it('object empty', () => {
        expect(isEmpty({})).toBe(true);
    });
    it('object non-empty', () => {
        expect(isEmpty({ a: null })).toBe(false);
    });

    it('array empty', () => {
        expect(isEmpty([])).toBe(true);
    });
    it('array non-empty', () => {
        expect(isEmpty([1])).toBe(false);
    });

    it('function', () => {
        expect(isEmpty(() => {})).toBe(false);
    });
});
