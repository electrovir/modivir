import {InitialOptionsTsJest} from 'ts-jest/dist/types';

const config: InitialOptionsTsJest = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: false,
    silent: false,
    setupFilesAfterEnv: ['./jest.setup.ts'],
    globals: {
        'ts-jest': {
            diagnostics: {
                warnOnly: true,
                ignoreCodes: ['TS151001'],
            },
        },
    },
};

export default config;
