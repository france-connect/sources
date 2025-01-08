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
  'identite_pivot',
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

module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: true,
  },
  plugins: [
    '@typescript-eslint',
    'cypress',
    'simple-import-sort',
    'import',
    'sort-destructure-keys',
    'sort-keys-fix',
  ],
  extends: [
    'plugin:@eslint-community/eslint-comments/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:cypress/recommended',
    'eslint:recommended',
    'prettier',
  ],
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-console': 2,
    '@eslint-community/eslint-comments/no-unused-disable': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 2,
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],

        leadingUnderscore: 'allow',
        // Enforce that all variables, functions and properties follow are camelCase
        selector: 'variableLike',
        filter: {
          regex: allowedSnakeCaseParametersRegexPattern,
          match: false,
        },
      },
      {
        format: ['camelCase', 'PascalCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        // Enforce that all variables are either in camelCase or UPPER_CASE
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
    'cypress/unsafe-to-chain-command': "error",
    'import/first': 2,
    'import/newline-after-import': 2,
    'import/no-anonymous-default-export': 2,
    'import/no-duplicates': 2,
    'linebreak-style': 'off',
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
        prev: ['function'],
        next: '*',
      },
    ],
    'simple-import-sort/exports': 2,
    'simple-import-sort/imports': [
      2,
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
          ['^@entities/'],
          ['^@fc/'],
          ['^@mocks/'],
          // Anything not matched in another group.
          ['^'],
          // Relative imports.
          ['^\\.'],
        ],
      },
    ],
    'sort-imports': 'off',
    'sort-keys-fix/sort-keys-fix': 2,
    'sort-destructure-keys/sort-destructure-keys': 2,
    'sort-keys': [
      2,
      'asc',
      {
        caseSensitive: true,
        natural: false,
        minKeys: 2,
      },
    ],
  },
};
