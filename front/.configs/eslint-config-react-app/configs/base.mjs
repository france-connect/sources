import js from '@eslint/js';
import json from '@eslint/json';
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs';
// @NOTE unable to get it resolved into this file
// eslint-disable-next-line import/no-unresolved
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import simpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import sortDestructureKeysPlugin from 'eslint-plugin-sort-destructure-keys';
import sortKeysFixPlugin from 'eslint-plugin-sort-keys-fix';
import globals from 'globals';

export const baseConfig = [
  {
    extends: [
      js.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.react,
      importPlugin.flatConfigs.typescript,
      comments.recommended,
      eslintPluginPrettierRecommended,
    ],
    ignores: ['**/*.json'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2020,
        ...globals.browser,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          generators: false,
          jsx: true,
          objectLiteralDuplicateProperties: false,
        },
        ecmaVersion: 2020,
        projectService: true,
        sourceType: 'module',
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: true,
    },
    plugins: {
      json,
      prettier: prettierPlugin,
      react: reactPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      'sort-destructure-keys': sortDestructureKeysPlugin,
      'sort-keys-fix': sortKeysFixPlugin,
    },
    rules: {
      '@eslint-community/eslint-comments/no-unused-disable': 2,
      'class-methods-use-this': [
        2,
        {
          enforceForClassFields: true,
          exceptMethods: [
            'render',
            'getInitialState',
            'getDefaultProps',
            'getChildContext',
            'componentWillMount',
            'UNSAFE_componentWillMount',
            'componentDidMount',
            'componentWillReceiveProps',
            'UNSAFE_componentWillReceiveProps',
            'shouldComponentUpdate',
            'componentWillUpdate',
            'UNSAFE_componentWillUpdate',
            'componentDidUpdate',
            'componentWillUnmount',
            'componentDidCatch',
            'getSnapshotBeforeUpdate',
          ],
        },
      ],
      // @NOTE dot-notation rule is disabled because extended by @typescript-eslint/dot-notation
      'dot-notation': 0,
      'import/extensions': [
        2,
        'ignorePackages',
        {
          js: 'always',
          jsx: 'always',
          mjs: 'always',
          ts: 'never',
          tsx: 'never',
        },
      ],
      'no-console': 2,
      'no-else-return': 2,
      'object-shorthand': [
        2,
        'always',
        {
          avoidQuotes: true,
          ignoreConstructors: false,
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
            ['^@fc/'],
            ['^'],
            ['^\\.'],
          ],
        },
      ],
      'sort-destructure-keys/sort-destructure-keys': [2],
      'sort-keys-fix/sort-keys-fix': [2],
      'valid-typeof': [
        2,
        {
          requireStringLiterals: true,
        },
      ],
    },
    settings: {
      'import/core-modules': [],
      'import/extensions': ['.cts', '.mjs', '.js', '.jsx', '.ts', '.tsx', '.d.ts'],
      'import/external-module-folders': ['node_modules', 'node_modules/@types'],
      'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
      'import/parsers': {
        '@typescript-eslint/parser': ['.cts', '.mjs', '.mts', '.ts', '.tsx', '.d.ts'],
      },
      'import/resolver': {
        node: {
          extensions: ['.cts', '.mts', '.mjs', '.json', '.js', '.jsx', '.ts', '.tsx', '.d.ts'],
        },
      },
      propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
      react: {
        pragma: 'React',
        version: 'detect',
      },
    },
  },
];
