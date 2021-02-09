// import { PluginDefinition } from 'apollo-server-core'
import { getApplicationArguments } from '../config/arguments';
import { HttpHeaderKey } from '../constants/http';
import { GraphQLError, separateOperations } from 'graphql';
import {
    directiveEstimator,
    getComplexity,
    simpleEstimator,
} from 'graphql-query-complexity';

const args = getApplicationArguments();
const isProduction = args.production === 'on';

const CLIENT_NAME_UNKNOWN = 'Unknown Client';

// WARNING: Do not just change this value !!
// all current max allowed queries and its depth depend on it
// so when changed load can be too high.
// So you change it, you check all! queries and adjust!!!
const MAX_COMPLEXITY = 500;

export const createPluginRequestDidStart = (schema: any) => {
    return () => ({
        // errors after parsing
        didResolveOperation({ request, document }: any) {
            // headers should include client information
            // to collect metrics
            if (isProduction && request.http && request.http.headers) {
                if (
                    !request.http.headers.get(HttpHeaderKey.ClientName) ||
                    !request.http.headers.get(HttpHeaderKey.ClientVersion) ||
                    request.http.headers.get(HttpHeaderKey.ClientName) ===
                        CLIENT_NAME_UNKNOWN
                ) {
                    throw new GraphQLError('Missing client identification');
                }
            }

            // calculate the complexity of the query
            // and break the request if it's too high
            const query = request.operationName
                ? separateOperations(document)[request.operationName]
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
    });
};
