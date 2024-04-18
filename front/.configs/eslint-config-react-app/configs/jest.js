module.exports = {
  extends: ['plugin:jest/all', 'plugin:jest-extended/all', 'plugin:testing-library/react'],
  overrides: [
    {
      env: {
        jest: true,
      },
      files: ['**/*.spec.ts', '**/*.spec.tsx'],
      plugins: ['jest', 'jest-extended', 'testing-library'],
      rules: {
        'jest/no-hooks': [
          2,
          {
            allow: ['beforeEach', 'afterEach'],
          },
        ],
        'jest/no-disabled-tests': 2,
        'jest/prefer-lowercase-title': 0,
        'jest/prefer-expect-assertions': 0,
        'react/jsx-props-no-spreading': 0,
        'testing-library/prefer-screen-queries': 0,
      },
    },
  ],
};
