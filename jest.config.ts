import type { Config } from 'jest';

const config: Config = {
    testMatch: ["**/tests/**/*.test.(ts|js)", ],
    transform: {
        "\\.[jt]sx?$": ["ts-jest", {
            "useESM": true
        }]
    },
    moduleNameMapper: {
        "(.+)\\.[jt]s": "$1"
    },
    extensionsToTreatAsEsm: [".ts"],
    setupFiles: [
        'dotenv/config'
    ],
    setupFilesAfterEnv: ['./tests/setupTests.ts'],
    
    moduleDirectories: ['node_modules']
};

// setupFilesAfterEnv: ['./tests/bootstrap.ts']

export default config;