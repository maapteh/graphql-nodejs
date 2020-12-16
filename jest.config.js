module.exports = {
    preset: 'ts-jest',
    verbose: true,
    testEnvironment: 'node',
    setupFiles: ['core-js'],
    moduleFileExtensions: ['ts', 'js', 'json', 'node'],
    modulePathIgnorePatterns: ['dist', '__experiments__', '__mocks__'],
    collectCoverageFrom: ['src/**/*.ts'],
    coveragePathIgnorePatterns: ['/node_modules/', '/__mocks__/', '/generated/'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
        '.*': 'babel-jest',
    },
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1',
        '^@tst/(.*)$': '<rootDir>/test/$1',
    },
    testEnvironment: "jest-environment-node"
};
