/* @ts-ignore */
/* tslint:disable */
/* auto generated, do not edit */
import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
    { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = {
    [X in Exclude<keyof T, K>]?: T[X];
} &
    { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: string;
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
};

/** cache control */
export const enum CacheControlScope {
    /** Personal data, based on jwt token and locale (see server.ts) */
    PRIVATE = 'PRIVATE',
    /** Public data, non personal */
    PUBLIC = 'PUBLIC',
}

export type Query = {
    __typename?: 'Query';
    /** Get specific crocodile */
    crocodile: Maybe<Crocodile>;
    /** Get all crocodiles in our zoo */
    crocodiles: Array<Crocodile>;
    /** Get current version of the server */
    version: Scalars['String'];
};

export type QueryCrocodileArgs = {
    id: Scalars['Int'];
};

/** Crocodile */
export type Crocodile = {
    __typename?: 'Crocodile';
    id: Scalars['Int'];
    name: Scalars['String'];
    sex: Gender;
    birthDate: Scalars['String'];
    age: Scalars['Int'];
};

export type CrocodileInput = {
    name: Scalars['String'];
    sex: Gender;
    birthDate: Scalars['String'];
    age: Scalars['Int'];
};

export const enum Gender {
    M = 'M',
    F = 'F',
}

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
    fragment: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
    selectionSet: string;
    resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
    | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
    | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
    | ResolverFn<TResult, TParent, TContext, TArgs>
    | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
    TResult,
    TKey extends string,
    TParent,
    TContext,
    TArgs
> {
    subscribe: SubscriptionSubscribeFn<
        { [key in TKey]: TResult },
        TParent,
        TContext,
        TArgs
    >;
    resolve?: SubscriptionResolveFn<
        TResult,
        { [key in TKey]: TResult },
        TContext,
        TArgs
    >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
    subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
    resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
    TResult,
    TKey extends string,
    TParent,
    TContext,
    TArgs
> =
    | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
    | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
    TResult,
    TKey extends string,
    TParent = {},
    TContext = {},
    TArgs = {}
> =
    | ((
          ...args: any[]
      ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
    | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
    parent: TParent,
    context: TContext,
    info: GraphQLResolveInfo,
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
    obj: T,
    context: TContext,
    info: GraphQLResolveInfo,
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
    TResult = {},
    TParent = {},
    TContext = {},
    TArgs = {}
> = (
    next: NextResolverFn<TResult>,
    parent: TParent,
    args: TArgs,
    context: TContext,
    info: GraphQLResolveInfo,
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
    CacheControlScope: CacheControlScope;
    Query: ResolverTypeWrapper<{}>;
    Int: ResolverTypeWrapper<Scalars['Int']>;
    String: ResolverTypeWrapper<Scalars['String']>;
    Crocodile: ResolverTypeWrapper<Crocodile>;
    CrocodileInput: CrocodileInput;
    Gender: Gender;
    Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
    Query: {};
    Int: Scalars['Int'];
    String: Scalars['String'];
    Crocodile: Crocodile;
    CrocodileInput: CrocodileInput;
    Boolean: Scalars['Boolean'];
};

export type CacheControlDirectiveArgs = {
    maxAge: Maybe<Scalars['Int']>;
    scope: Maybe<CacheControlScope>;
};

export type CacheControlDirectiveResolver<
    Result,
    Parent,
    ContextType = any,
    Args = CacheControlDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ComplexityDirectiveArgs = {
    value: Scalars['Int'];
    multipliers: Maybe<Array<Scalars['String']>>;
};

export type ComplexityDirectiveResolver<
    Result,
    Parent,
    ContextType = any,
    Args = ComplexityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type QueryResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = {
    crocodile: Resolver<
        Maybe<ResolversTypes['Crocodile']>,
        ParentType,
        ContextType,
        RequireFields<QueryCrocodileArgs, 'id'>
    >;
    crocodiles: Resolver<
        Array<ResolversTypes['Crocodile']>,
        ParentType,
        ContextType
    >;
    version: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type CrocodileResolvers<
    ContextType = any,
    ParentType extends ResolversParentTypes['Crocodile'] = ResolversParentTypes['Crocodile']
> = {
    id: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    name: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    sex: Resolver<ResolversTypes['Gender'], ParentType, ContextType>;
    birthDate: Resolver<ResolversTypes['String'], ParentType, ContextType>;
    age: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
    __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
    Query: QueryResolvers<ContextType>;
    Crocodile: CrocodileResolvers<ContextType>;
};

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = any> = Resolvers<ContextType>;
export type DirectiveResolvers<ContextType = any> = {
    cacheControl: CacheControlDirectiveResolver<any, any, ContextType>;
    complexity: ComplexityDirectiveResolver<any, any, ContextType>;
};

/**
 * @deprecated
 * Use "DirectiveResolvers" root object instead. If you wish to get "IDirectiveResolvers", add "typesPrefix: I" to your config.
 */
export type IDirectiveResolvers<
    ContextType = any
> = DirectiveResolvers<ContextType>;
