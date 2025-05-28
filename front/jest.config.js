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
  collectCoverageFrom: ['apps/**/*.@(ts|tsx)', 'libs/**/*.@(ts|tsx)', 'instances/**/*.@(ts|tsx)'],
  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    '.*.d.ts',
    '.configs/',
    '/__mocks__/',
    '/__fixtures__/',
    '.+/index.ts',
    '.+.(context|error|exception|enum).ts',
    '.+.(routes).tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  moduleNameMapper: {
    '^.+\\.(css|scss)$': 'identity-obj-proxy',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testEnvironment: 'jsdom',
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
