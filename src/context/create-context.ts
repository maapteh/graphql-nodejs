import { HttpHeaderKey } from '../constants/http';

// TODO: JSON parse is blocking eventloop now blocks for 1-2ms will ask for update on api entry to pass memberId on header just like webauth proxy is doig for web
const atob = require('atob');

const getMemberId = (token: string) => {
    try {
        const jwt = JSON.parse(atob(token.split('.')[1]));
        return jwt?.mid || null;
    } catch {
        return null;
    }
};


// TODO: use typing of ContextFunction of apollo-server-core
export const createContext = async ({ req, connection, res }: any) => {
    const { headers } = req;
    const authorizationHeader = headers[HttpHeaderKey.Authorization] || '';

    const token = Array.isArray(authorizationHeader)
        ? authorizationHeader[0]
        : authorizationHeader;

    const locale = 'nl_NL';
    const memberId = token ? getMemberId(token) : null;

    const loginState = headers['x-auth-login-state'] || 'anonymous';

    // HINT: Only stuff EVERY module will need, else we have middleware for Modules!
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
            // logger: Logger;
            correlationId?: string;
        }
    }
}
