export enum Environment {
    LOCAL = 'local',
    DEVELOPMENT = 'dev',
    TEST = 'tst',
    ACCEPTANCE = 'acc',
    PRODUCTION = 'prd',
}

// not using same name as Environment
export const GraphVariantMap = {
    [Environment.LOCAL]: 'local',
    [Environment.DEVELOPMENT]: 'local',
    [Environment.TEST]: 'test',
    [Environment.ACCEPTANCE]: 'acceptance',
    [Environment.PRODUCTION]: 'production',
};
