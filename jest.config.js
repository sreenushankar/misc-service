"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    transform: {
        "\\.[jt]sx?$": "ts-jest",
    },
    "globals": {
        "ts-jest": {
            "useESM": true
        }
    },
    moduleNameMapper: {
        "(.+)\\.js": "$1"
    },
    extensionsToTreatAsEsm: [".ts"],
    setupFiles: [
        'dotenv/config'
    ],
    setupFilesAfterEnv: ['./tests/setupTests.ts']
};
//moduleDirectories: ['node_modules', 'src']
exports.default = config;
//# sourceMappingURL=jest.config.js.map