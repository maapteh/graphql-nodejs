import express from 'express';
import { GraphQLError } from 'graphql';
import { gql } from 'graphql-modules';
import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { RedisCache } from 'apollo-server-cache-redis';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { ApplicationArguments } from './config/arguments';
import { prometheus } from './middleware/prometheus';
import { MOCKS } from './__mocks__';
import { GraphVariantMap } from './constants/environment';
import { Route } from './constants/route';
import { config } from './config';
import { logger } from './helpers/logger';
import { HttpHeaderKey } from './constants/http';
import { executor } from './executor';
import { getApplicationArguments } from './config/arguments';
import { createContext } from './context/create-context';
import { createPluginRequestDidStart } from './plugins/create-request-did-start';

const HttpsProxyAgent = require('https-proxy-agent');


const args = getApplicationArguments();

const ON = 'on';

// Metrics for apollo engine
const CLIENT_NAME_UNKNOWN = 'Unknown Client';
const CLIENT_VERSION_UNKNOWN = 'Unversioned';

const PORT = parseInt((args as any).port, 10);

const isProduction = args.production === ON;

const mocks = args.mock === ON ? MOCKS : false;
const playground = args.playground === ON;
const tracing = args.tracing === ON;
const caching = args.caching === ON;
const memcache = args.memcache === ON;

const graphVariant = GraphVariantMap[args.profile];

const collectMetrics = args.prometheus === ON;

const proxy = args.proxy;
const agent = proxy ? new HttpsProxyAgent(proxy) : false;


const typeDefs = gql`
    type Query {
        version: String!
    }

    directive @complexity(
        value: Int!
            multipliers: [String!]
    ) on FIELD_DEFINITION

    enum CacheControlScope {
        PRIVATE
        PUBLIC
    }

    directive @cacheControl(
        maxAge: Int
        scope: CacheControlScope
    ) on OBJECT | FIELD_DEFINITION | INTERFACE
`;

const resolvers = {
    Query: {
        version: () => process.env.npm_package_version,
    },
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

const executorFn = executor(schema);
const requestDidStart = createPluginRequestDidStart(schema);

const server = new ApolloServer({
    schema,

    // context: createContext,

    executor: executorFn,

    // on production disable all development features
    introspection: isProduction ? false : tracing,
    tracing: isProduction ? false : tracing,
    playground: isProduction ? false : playground,
    mocks: isProduction ? false : mocks,

    // hide internal error details in error responses
    formatError: (error: GraphQLError): GraphQLError => {
        logger.error(error, 'Query Error');

        // make sure error is not logged in response when deployed
        if (!config.server.logErrors) {
            delete error.extensions?.exception;
        }

        return error;
    },


    // apollo studio configuration
    engine: args.apolloStudioKey
        ? {
                apiKey: args.apolloStudioKey,
                reportSchema: true,
                graphVariant: isProduction ? graphVariant : 'unknown',
                requestAgent: proxy ? agent : undefined,
                generateClientInfo: ({ request }) => {
                    const headers = request.http?.headers;

                    if (headers) {
                        const clientName = headers.get(
                            HttpHeaderKey.ClientName,
                        );
                        const clientVersion = headers.get(
                            HttpHeaderKey.ClientVersion,
                        );

                        if (clientName && clientVersion) {
                            return {
                                clientName,
                                clientVersion,
                            };
                        }
                    }

                    return {
                        clientName: CLIENT_NAME_UNKNOWN,
                        clientVersion: CLIENT_VERSION_UNKNOWN,
                    };
                },
            }
        : false,

    /*
    cacheControl: caching,
    cache: memcache ? new RedisCache(config.server.redis) : undefined,
    plugins: [
        caching
            ? responseCachePlugin({
                    sessionId: requestContext =>
                        (requestContext.request.http &&
                            requestContext.request.http.headers.get(
                                HttpHeaderKey.Authorization,
                            )) ||
                        null,
                    extraCacheKeyData: requestContext =>
                        (requestContext.request.http &&
                            requestContext.request.http.headers.get(
                                HttpHeaderKey.Locale,
                            )) ||
                        null,
                })
            : {},
        {
            requestDidStart
        },
    ],
    */
});

const app = express();

app.disable('x-powered-by');

if (!isProduction) {
    app.use(
        Route.Voyager,
        voyagerMiddleware({ endpointUrl: Route.GraphQL }),
    );
}

// for accessing the container directly
// this won't be called in prod because apache doesn't use our path
// but uses a path defined in their config - this path should be the same as
// the redirected path below
app.get('/', function (_req, res) {
    res.redirect(Route.GraphQL);
});

if (collectMetrics) {
    app.use(
        prometheus({
            metricsPath: Route.Metrics,
        }),
    );
}

// log requests in development mode for debugging purposes
if (!isProduction) {
    app.use((req, _res, next) => {
        if (![Route.Metrics, Route.Health].map(String).includes(req.path)) {
            logger.debug(req, 'Incoming HTTP Request');
        }
        next();
    });
}

server.applyMiddleware({
    app,
    path: Route.GraphQL,
    cors: false,
});

app.get(Route.Health, (_req, res) => {
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log('------ arguments ------');

    for (let [key, value] of Object.entries(args)) {
        console.log(`${key}: ${value}`);
    }

    console.log(
        `🔥 ${
            isProduction
                ? 'Running in "production" profile, no mocking tracing and playground available'
                : 'Running in "development" profile'
        }`,
    );

    console.log(
        `🚀 GraphQL express server running at http://localhost:${PORT}${server.graphqlPath}`,
    );
});

