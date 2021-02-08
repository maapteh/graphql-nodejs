export type TBuilder<O> = (attrs?: Partial<O>) => O;

export const builderFor = <O extends {}>(defaults: O): TBuilder<O> => (
    attrs = {},
) => ({
    ...defaults,
    ...attrs,
});
