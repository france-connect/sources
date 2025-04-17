import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { defineConfig } from 'eslint/config';
import pluginChaiFriendly from 'eslint-plugin-chai-friendly';
import cypress from 'eslint-plugin-cypress';
import _import from 'eslint-plugin-import';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import sortDestructureKeys from 'eslint-plugin-sort-destructure-keys';
import sortKeysFix from 'eslint-plugin-sort-keys-fix';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// eslint-disable-next-line no-redeclare, @typescript-eslint/naming-convention
const __filename = fileURLToPath(import.meta.url);
// eslint-disable-next-line no-redeclare, @typescript-eslint/naming-convention
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
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
  'fs_label',
  'given_name',
  'given_name_array',
  'grant_types',
  'grant_types_supported',
  'identite_pivot',
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
  'original_addresses',
  'organizational_unit',
  'phone_number',
  'post_logout_redirect_uri',
  'post_logout_redirect_uris',
  'postal_code',
  'preferred_username',
  'pushed_authorization_request',
  'redirect_uri',
  'redirect_uris',
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
  'tech_id',
  'token_endpoint',
  'token_endpoint_auth_method',
  'token_introspection',
  'token_type',
  'type_action',
  'userinfo_encrypted_response_alg',
  'userinfo_encrypted_response_enc',
  'userinfo_endpoint',
  'userinfo_signed_response_alg',
  'usual_name',
];

const allowedSnakeCaseParametersRegexPattern = `^(${allowedSnakeCaseParameters.join('|')})$`;

export default defineConfig([
  {
    extends: compat.extends(
      'plugin:@eslint-community/eslint-comments/recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:cypress/recommended',
      'eslint:recommended',
      'prettier',
    ),

    languageOptions: {
      ecmaVersion: 5,

      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parser: tsParser,
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
      },

      sourceType: 'commonjs',
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      'chai-friendly': pluginChaiFriendly,
      cypress,
      import: fixupPluginRules(_import),
      'simple-import-sort': simpleImportSort,
      'sort-destructure-keys': sortDestructureKeys,
      'sort-keys-fix': sortKeysFix,
    },

    rules: {
      '@eslint-community/eslint-comments/no-unused-disable': 'error',
      '@typescript-eslint/camelcase': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 2,
      '@typescript-eslint/naming-convention': [
        'error',
        {
          filter: {
            match: false,
            regex: allowedSnakeCaseParametersRegexPattern,
          },
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',

          selector: 'variableLike',
        },
        {
          filter: {
            match: false,
            regex: allowedSnakeCaseParametersRegexPattern,
          },
          format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
          leadingUnderscore: 'allow',

          selector: 'memberLike',
        },
        {
          format: null,
          modifiers: ['requiresQuotes'],
          selector: 'property',
        },
      ],

      '@typescript-eslint/no-unused-expressions': 0,

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'chai-friendly/no-unused-expressions': 2,
      'cypress/unsafe-to-chain-command': 'error',

      'import/first': 2,
      'import/newline-after-import': 2,
      'import/no-anonymous-default-export': 2,
      'import/no-duplicates': 2,
      'linebreak-style': 'off',
      'no-console': 2,
      'no-unused-expressions': 0,

      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      'padding-line-between-statements': [
        2,
        {
          blankLine: 'always',
          next: '*',
          prev: ['function'],
        },
      ],

      'simple-import-sort/exports': 2,

      'simple-import-sort/imports': [
        2,
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

      'sort-destructure-keys/sort-destructure-keys': 2,
      'sort-imports': 'off',
      'sort-keys': [
        2,
        'asc',
        {
          caseSensitive: true,
          minKeys: 2,
          natural: false,
        },
      ],

      'sort-keys-fix/sort-keys-fix': 2,
    },
  },
]);
