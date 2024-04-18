/* istanbul ignore file */

/** @type {import('ts-jest').JestConfigWithTsJest} */

/* ------------------------------------------------------
 *
 * Jest main config file
 *
 * @NOTE file initialized with `ts-jest`
 * @see https://kulshekhar.github.io/ts-jest/docs/getting-started/installation#jest-config-file
 *
  ------------------------------------------------------ */
module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'apps/**/*.@(ts|tsx)',
    'libs/**/*.@(ts|tsx)',
    'instances/**/*.@(ts|tsx)',
    '!**/*.d.ts',
    '!.configs/*',
    '!**/__mocks__/*',
    '!**/__fixtures__/*',
  ],
  coverageDirectory: '<rootDir>/coverage',
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.svg$': 'jest-transformer-svg',
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/tsconfig.jest.json',
      },
    ],
  },
};
