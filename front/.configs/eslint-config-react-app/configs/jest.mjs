import jestPlugin from 'eslint-plugin-jest';
import jestExtendedPlugin from 'eslint-plugin-jest-extended';
import testingLibraryPlugin from 'eslint-plugin-testing-library';

export const jestConfig = [
  {
    extends: [
      jestPlugin.configs['flat/all'],
      jestExtendedPlugin.configs['flat/all'],
      testingLibraryPlugin.configs['flat/react'],
    ],
    files: ['**/*.spec.ts', '**/*.spec.tsx'],
    languageOptions: {
      globals: jestPlugin.environments.globals.globals,
    },
    rules: {
      'jest/no-disabled-tests': 2,
      'jest/no-hooks': [
        2,
        {
          allow: ['beforeEach', 'afterEach'],
        },
      ],
      'jest/prefer-expect-assertions': 0,
      'jest/prefer-importing-jest-globals': 0,
      'jest/prefer-lowercase-title': 0,
      'react/jsx-props-no-spreading': 0,
      'testing-library/prefer-screen-queries': 0,
    },
  },
];
