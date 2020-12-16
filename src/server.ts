import express from 'express';
import { GraphQLError, separateOperations } from 'graphql';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server-express';
import { RedisCache } from 'apollo-server-cache-redis';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import {
    getComplexity,
    simpleEstimator,
    directiveEstimator,
} from 'graphql-query-complexity';
import { ApplicationArguments } from './config/arguments';
import { prometheus } from './middleware/prometheus';
import { MOCKS } from './__mocks__';
import { GraphVariantMap } from './constants/environment';
import { Route } from './constants/route';
import { config } from './config';
import { logger } from './helpers/logger';
import { HttpHeaderKey } from './constants/http';
// import { executor } from './executor';

const atob = require('atob');

const HttpsProxyAgent = require('https-proxy-agent');

const ON = 'on';

// Metrics for apollo engine
const CLIENT_NAME_UNKNOWN = 'Unknown Client';
const CLIENT_VERSION_UNKNOWN = 'Unversioned';

export const bootstrap: any = async (
    AppModule: any,
    args: ApplicationArguments,
) => {
    const schema = AppModule.createSchemaForApollo();

    SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
        //
    });

    const PORT = parseInt((args as any).port, 10);

    const isProduction = args.production === ON;

    const mocks = args.mock === ON ? MOCKS : false;
    const playground = args.playground === ON;
    const tracing = args.tracing === ON;
    const caching = args.caching === ON;
    const memcache = args.memcache === ON;

    const graphVariant = GraphVariantMap[args.profile];

    // WARNING: Do not just change this value !!
    // all current max allowed queries and its depth depend on it
    // so when changed load can be too high.
    // So you change it, you check all! queries and adjust!!!
    const MAX_COMPLEXITY = 500;

    const collectMetrics = args.prometheus === ON;

    var proxy = args.proxy;
    var agent = new HttpsProxyAgent(proxy);

    const server = new ApolloServer({
        schema,
        context: async ({ req, connection, res }) => {
            const { headers } = req;
            const authorizationHeader =
                headers[HttpHeaderKey.Authorization] || '';

            const token = Array.isArray(authorizationHeader)
                ? authorizationHeader[0]
                : authorizationHeader;

            const locale = 'ru_RU';

            let memberId = null;
            try {
                const jwt = JSON.parse(atob(token.split('.')[1]));
                memberId = jwt.mid;
            } catch {}

            const loginState = headers['x-auth-login-state'] || 'anonymous';

            return {
                token,
                memberId,
                locale,
                loginState,
                // FIXME: for now fixed need to be in our api configurable, name for it needs to be defined
                shoppingCartId: 1,
                session: {
                    req,
                    res,
                },
            };
        },

        // FIXME: https://github.com/zalando-incubator/graphql-jit/issues/90#issuecomment-701447123
        // executor: executor(schema),

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
                requestDidStart: () => ({
                    // errors after parsing
                    didResolveOperation({ request, document }) {
                        logger.debug(
                            {
                                request,
                            },
                            'Incoming GraphQL Query',
                        );

                        // headers should include client information
                        // to collect metrics
                        if (
                            isProduction &&
                            request.http &&
                            request.http.headers
                        ) {
                            if (
                                !request.http.headers.get(
                                    HttpHeaderKey.ClientName,
                                ) ||
                                !request.http.headers.get(
                                    HttpHeaderKey.ClientVersion,
                                ) ||
                                request.http.headers.get(
                                    HttpHeaderKey.ClientName,
                                ) === CLIENT_NAME_UNKNOWN
                            ) {
                                throw new GraphQLError(
                                    'Missing client identification',
                                );
                            }
                        }

                        // calculate the complexity of the query
                        // and break the request if it's too high
                        const query = request.operationName
                            ? separateOperations(document)[
                                  request.operationName
                              ]
                            : document;

                        const complexity = getComplexity({
                            schema,
                            query,
                            variables: request.variables,
                            estimators: [
                                directiveEstimator(),
                                simpleEstimator({ defaultComplexity: 0 }),
                            ],
                        });

                        if (complexity >= MAX_COMPLEXITY) {
                            throw new GraphQLError(
                                `Your query complexity is too high: ${complexity}, max allowed complexity: ${MAX_COMPLEXITY}`,
                            );
                        }
                        // TODO: implementing max hourly complexity rate?
                    },
                }),
            },
        ],
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
};

declare global {
    namespace GraphQLModules {
        interface GlobalContext {
            req: any;
            res: any;
            token: string;
            // FIXME: number | null, but then our directives guard it but not picked up in typings in resolver
            memberId: number;
            shoppingCartId: number;
            loginState: any;
            locale: any;
            correlationId?: string;
        }
    }
}
