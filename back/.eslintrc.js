module.exports = {
  env: {
    jest: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ],
  ignorePatterns: ['**/*.ejs'],
  overrides: [
    {
      files: ['**/*.ejs'],
      rules: {},
    },
    {
      files: ['**/*.spec.ts', '**/*.spec.js'],
      rules: {
        'max-nested-callbacks': 'off',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './*/tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'simple-import-sort', 'import'],
  root: true,
  rules: {
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Function: false,
          object: false,
        },
      },
    ],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],

        leadingUnderscore: 'allow',
        // Enforce that all variables, functions and properties follow are camelCase
        selector: 'variableLike',
      },
      {
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],

        leadingUnderscore: 'allow',
        // Enforce that all variables are either in camelCase or UPPER_CASE
        selector: 'memberLike',
      },
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    complexity: ['error', { max: 4 }],
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'max-depth': ['error', { max: 2 }],
    'max-params': ['error', { max: 4 }],
    'max-statements-per-line': ['error', { max: 1 }],
    'no-param-reassign': 'error',
    'no-unused-vars': 'off',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // CSS... Side effect imports.
          ['^\\u0000'],
          // NodeJS packages/libraries
          // +more si besoin
          ['^fs$', '^path$', '^crypto$'],
          // Things that start with a letter
          ['^@?\\w'],
          //
          ['^@nestjs'],
          ['^@fc/'],
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          ['^\\.'],
        ],
      },
    ],
    'sort-imports': 'off',
    'max-nested-callbacks': ['error', { max: 1 }],
  },
};
