module.exports = {
  overrides: [
    {
      files: ['**/*.js', '**/*.jsx'],
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-explicit-any': 2,
        '@typescript-eslint/ban-types': [
          2,
          {
            types: {
              Function: false,
              object: false,
            },
          },
        ],
        '@typescript-eslint/consistent-type-imports': [
          2,
          {
            prefer: 'type-imports',
          },
        ],
        '@typescript-eslint/dot-notation': [
          2,
          {
            allowKeywords: true,
            allowPattern: '',
            allowPrivateClassPropertyAccess: false,
            allowProtectedClassPropertyAccess: false,
            allowIndexSignaturePropertyAccess: false,
          },
        ],
        '@typescript-eslint/naming-convention': [
          2,
          {
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            selector: 'variableLike',
          },
          {
            format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
            leadingUnderscore: 'allow',
            selector: 'memberLike',
          },
        ],
      },
    },
    {
      files: ['**/*.d.ts'],
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/naming-convention': 0,
      },
    },
  ],
};
