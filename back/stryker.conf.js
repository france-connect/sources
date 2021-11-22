/**
 * @type {import('@stryker-mutator/api/core').StrykerOptions}
 */
module.exports = {
  mutator: 'typescript',
  packageManager: 'yarn',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'jest',
  transpilers: [],
  coverageAnalysis: 'off',
  tsconfigFile: 'tsconfig.build.json',
  mutate: [
    'libs/**/*.{ts,tsx}',
    '!libs/**/*.spec.{ts,tsx}',
    '!libs/**/*.module.ts',
  ],
};
