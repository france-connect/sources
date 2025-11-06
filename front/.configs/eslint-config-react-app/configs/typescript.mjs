// @NOTE unable to get it resolved into this file
// eslint-disable-next-line import/no-unresolved
import tseslint from 'typescript-eslint';

export const typescriptConfig = tseslint.config([
  tseslint.configs.recommendedTypeChecked,
  {
    extends: [tseslint.configs.disableTypeChecked],
    files: ['**/*.mjs', '**/*.js', '**/*.jsx', '**/*.json'],
  },
  {
    extends: [tseslint.configs.strictTypeChecked],
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        2,
        {
          prefer: 'type-imports',
        },
      ],
      '@typescript-eslint/default-param-last': 2,
      '@typescript-eslint/dot-notation': [
        2,
        {
          allowIndexSignaturePropertyAccess: false,
          allowKeywords: true,
          allowPattern: '',
          allowPrivateClassPropertyAccess: false,
          allowProtectedClassPropertyAccess: false,
        },
      ],
      '@typescript-eslint/func-call-spacing': 0,
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
      '@typescript-eslint/no-dupe-class-members': 2,
      '@typescript-eslint/no-empty-function': [
        2,
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 2,
      '@typescript-eslint/no-loop-func': 2,
      '@typescript-eslint/no-magic-numbers': [
        0,
        {
          detectObjects: false,
          enforceConst: true,
          ignore: [],
          ignoreArrayIndexes: true,
        },
      ],
      '@typescript-eslint/no-redeclare': 2,
      '@typescript-eslint/no-shadow': 2,
      '@typescript-eslint/no-unnecessary-type-parameters': 0,
      '@typescript-eslint/no-unused-expressions': [
        2,
        {
          allowShortCircuit: false,
          allowTaggedTemplates: false,
          allowTernary: false,
          enforceForJSX: false,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        2,
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': [
        2,
        {
          classes: true,
          functions: true,
          variables: true,
        },
      ],
      '@typescript-eslint/return-await': [2, 'in-try-catch'],
    },
  },
]);
