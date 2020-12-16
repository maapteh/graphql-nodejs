export function buildQueryString(params: { [key: string]: any }): string {
    const paramsString = Object.entries(params)
        .filter(([_key, value]) => typeof value !== 'undefined')
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    return paramsString ? encodeURI('?' + paramsString) : '';
}
