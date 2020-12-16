export const mapObject = <TIn, TOut, TKey extends number | string | symbol>(
    fn: (obj: TIn, key: TKey) => TOut,
    target: Record<TKey, TIn>,
): Record<TKey, TOut> =>
    (Object.entries(target) as [TKey, TIn][]).reduce(
        (acc, [key, val]) => ({
            ...acc,
            [key]: fn(val, key),
        }),
        {} as Record<TKey, TOut>,
    );
