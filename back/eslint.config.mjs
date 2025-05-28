import typescriptEslintPlugin from '@typescript-eslint/eslint-plugin';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import _import from 'eslint-plugin-import';
import jestExtended from 'eslint-plugin-jest-extended';
import { fixupPluginRules } from '@eslint/compat';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

/**
 * According to the OIDC specification, certain parameters must use snake_case naming conventions.
 * To avoid adding ESLint ignore comments for each line where these parameters are used,
 * we configure ESLint to ignore these specific variable names in the naming-convention rule.
 * Also, certain business logic force us using snake_case naming conventions.
 */
const allowedSnakeCaseParameters = [
  'access_token',
  'acr_values',
  'application_type',
  'authorization_endpoint',
  'belonging_population',
  'check_session',
  'client_id',
  'client_secret',
  'code_verification',
  'device_authorization',
  'end_session',
  'end_session_endpoint',
  'error_description',
  'error_detail',
  'error_uri',
  'family_name',
  'given_name',
  'given_name_array',
  'grant_types',
  'grant_types_supported',
  'id_token',
  'id_token_encrypted_response_alg',
  'id_token_encrypted_response_enc',
  'id_token_hint',
  'id_token_signed_response_alg',
  'idp_acr',
  'idp_birthdate',
  'idp_hint',
  'idp_id',
  'is_service_public',
  'jwks_uri',
  'login_hint',
  'organizational_unit',
  'phone_number',
  'post_logout_redirect_uri',
  'post_logout_redirect_uris',
  'postal_code',
  'preferred_username',
  'pushed_authorization_request',
  'redirect_uri',
  'redirect_uris',
  'sector_identifier_uri',
  'refresh_token',
  'rep_scope',
  'response_type',
  'response_types',
  'revocation_endpoint_auth_method',
  'rnipp_birth',
  'rnipp_birthcountry',
  'rnipp_birthdate',
  'rnipp_birthplace',
  'rnipp_family_name',
  'rnipp_gender',
  'rnipp_given_name',
  'rnipp_given_name_array',
  'rnipp_identite_pivot',
  'rnipp_profile',
  'signup_id',
  'sp_id',
  'street_address',
  'token_endpoint',
  'token_endpoint_auth_method',
  'token_introspection',
  'token_type',
  'userinfo_encrypted_response_alg',
  'userinfo_encrypted_response_enc',
  'userinfo_endpoint',
  'userinfo_signed_response_alg',
  'usual_name',
];

const allowedSnakeCaseParametersRegexPattern = `^(${allowedSnakeCaseParameters.join('|')})$`;

export default [
  {
    ignores: ['**/*.ejs', 'eslint.config.mjs'],
  },
  ...compat.extends(
    'plugin:@eslint-community/eslint-comments/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'prettier',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
      'simple-import-sort': simpleImportSort,
      import: fixupPluginRules(_import),
      'jest-extended': jestExtended,
    },

    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
      },

      parser: tsParser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      '@eslint-community/eslint-comments/no-unused-disable': 'error',

      '@typescript-eslint/no-restricted-types': ['error'],
      '@typescript-eslint/no-empty-object-type': ['error'],
      '@typescript-eslint/no-unsafe-function-type': ['error'],
      '@typescript-eslint/no-wrapper-object-types': ['error'],

      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',

      '@typescript-eslint/naming-convention': [
        'error',
        {
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          selector: 'variableLike',

          filter: {
            regex: allowedSnakeCaseParametersRegexPattern,
            match: false,
          },
        },
        {
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',
          selector: 'memberLike',

          filter: {
            regex: allowedSnakeCaseParametersRegexPattern,
            match: false,
          },
        },
        {
          format: null,
          selector: 'property',
          modifiers: ['requiresQuotes'],
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

      complexity: [
        'error',
        {
          max: 4,
        },
      ],

      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      'max-depth': [
        'error',
        {
          max: 2,
        },
      ],

      'max-params': [
        'error',
        {
          max: 4,
        },
      ],

      'max-statements-per-line': [
        'error',
        {
          max: 1,
        },
      ],

      'no-param-reassign': 'error',
      'no-unused-vars': 'off',
      'simple-import-sort/exports': 'error',

      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\u0000'],
            ['^fs$', '^path$', '^crypto$'],
            ['^@?\\w'],
            ['^@nestjs'],
            ['^@entities/'],
            ['^@fc/'],
            ['^@mocks/'],
            ['^'],
            ['^\\.'],
          ],
        },
      ],

      'sort-imports': 'off',

      'max-nested-callbacks': [
        'error',
        {
          max: 1,
        },
      ],

      'require-await': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
    },
  },
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
];
