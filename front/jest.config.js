module.exports = {
  collectCoverageFrom: [
    'libs/**/*.@(ts|tsx)',
    // @TODO le ignore de '/apps/agent-connect/' est temporaire, à supprimer
    'apps/!(agent-connect)/**/*.@(ts|tsx)',
    '!**/*.d.ts',
    '!**/setupTests.ts',
  ],
  coverageDirectory: './coverage',
  moduleNameMapper: {
    '@fc/backoffice': '<rootDir>/libs/backoffice/src',
    '@fc/backoffice/(.*)': '<rootDir>/libs/backoffice/src/$1',
    '@fc/common': '<rootDir>/libs/common/src',
    '@fc/common/(.*)': '<rootDir>/libs/common/src/$1',
    '@fc/dsfr': '<rootDir>/libs/dsfr/src',
    '@fc/dsfr/(.*)': '<rootDir>/libs/dsfr/src/$1',
    '@fc/loading': '<rootDir>/libs/loading/src',
    '@fc/loading/(.*)': '<rootDir>/libs/loading/src/$1',
    '@fc/oidc-client': '<rootDir>/libs/oidc-client/src',
    '@fc/oidc-client/(.*)': '<rootDir>/libs/oidc-client/src/$1',
    '@fc/routing': '<rootDir>/libs/routing/src',
    '@fc/routing/(.*)': '<rootDir>/libs/routing/src/$1',
    '@fc/state-management': '<rootDir>/libs/state-management/src',
    '@fc/state-management/(.*)': '<rootDir>/libs/state-management/src/$1',
    '@fc/tests-utils': '<rootDir>/tests-utils',
    '@fc/tests-utils/(.*)': '<rootDir>/tests-utils/$1',
    '@fc/tracks': '<rootDir>/libs/tracks/src',
    '@fc/tracks/(.*)': '<rootDir>/libs/tracks/src/$1',
    /**
     * Mock images and SCSS import as jest does not have the "magic" webpack has
     * to handle raw imports of those files in components definitions and would crash
     * while attempting to interpret such import as javascript or typescript.
     * @see https://create-react-app.dev/docs/adding-a-stylesheet/
     */
    '\\.(scss|css)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.svg$': '<rootDir>/__mocks__/svgrMock.js',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/apps/', '<rootDir>/libs/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  testEnvironment: 'jest-environment-jsdom',
  // @TODO le ignore de '/apps/agent-connect/' est temporaire, à supprimer
  testPathIgnorePatterns: ['/node_modules/', '/cypress/', '/apps/agent-connect/'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
};
