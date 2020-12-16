/**
 * Check if value is not null or empty using typescript guards.
 * Useful to filter out empty values from arrays
 * @template TValue generic
 * @param value value to check
 * @returns {boolean} whether value is defined
 * @example
 * isDefined(null)
 * //=> false
 * @example
 * isDefined({})
 * //=> true
 * @example
 * // removes null/undefined when used as filter with correct typing
 * const list: (number | undefined)[] = [1, undefined]
 * list.filter(isDefined)
 * //=> [1]: number[]
 */
export const isDefined = <TValue>(
    value: TValue | null | undefined,
): value is TValue => {
    return value !== null && value !== undefined;
};
