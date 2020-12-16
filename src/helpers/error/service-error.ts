import { GraphQLError } from 'graphql';

export class ServiceError extends GraphQLError {
    constructor(
        message: string,
        public statusCode?: number,
        public text?: string,
    ) {
        super(message);
    }
}
