import { isDefined } from './is-defined';

export const isEmpty = (target: any): boolean => {
    if (!isDefined(target)) {
        return true;
    }

    if (typeof target === 'string' && !target.length) {
        return true;
    }

    if (Array.isArray(target) && !target.length) {
        return true;
    }

    if (typeof target === 'object' && !Object.keys(target).length) {
        return true;
    }

    return false;
};
