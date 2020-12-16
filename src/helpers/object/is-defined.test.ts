import { isDefined } from './is-defined';

describe('common/object/is-defined', () => {
    it('recognizes null', () => {
        const target = null;
        const expected = false;
        const result = isDefined(target);
        expect(result).toBe(expected);
    });

    it('recognizes undefined', () => {
        const target = undefined;
        const expected = false;
        const result = isDefined(target);
        expect(result).toBe(expected);
    });

    it('recognizes empty objects', () => {
        const target = {};
        const expected = true;
        const result = isDefined(target);
        expect(result).toBe(expected);
    });

    it('recognizes literals', () => {
        const target = 5;
        const expected = true;
        const result = isDefined(target);
        expect(result).toBe(expected);
    });
});
