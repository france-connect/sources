module.exports = {
  env: {
    node: true,
    es2020: true,
    browser: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/react',
    'plugin:import/typescript',
    'plugin:@typescript-eslint/strict-type-checked',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {},
  ignorePatterns: [
    '**/tmp',
    '**/temp',
    '**/dist',
    '**/build',
    '**/public',
    '**/scripts',
    '**/coverage',
    '**/node_modules',
    '**/__mocks__',
    '**/__fixtures__',
    '**/__snapshots__',
    '**/*.css',
    '**/*.scss',
    // @NOTE
    // Ces deux fichiers semblent être problématique pour eslint
    // C'est la regle jest/unbound-method qui pose ici probleme
    '**/jest.config.js',
    '**/vite.config.js',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
      generators: false,
      objectLiteralDuplicateProperties: false,
    },
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['simple-import-sort', 'sort-destructure-keys', 'sort-keys-fix', 'prettier'],
  reportUnusedDisableDirectives: true,
  rules: {
    'class-methods-use-this': [
      2,
      {
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
        enforceForClassFields: true,
      },
    ],
    'no-else-return': 2,
    // @NOTE dot-notation rule is disabled because extended by @typescript-eslint/dot-notation
    'dot-notation': 0,
    'no-console': 2,
    'object-shorthand': [
      2,
      'always',
      {
        ignoreConstructors: false,
        avoidQuotes: true,
      },
    ],
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
  },
  settings: {
    'import/core-modules': [],
    'import/extensions': ['.js', '.cts', '.mjs', '.jsx', '.ts', '.tsx', '.d.ts'],
    'import/external-module-folders': ['node_modules', 'node_modules/@types'],
    'import/ignore': ['node_modules', '\\.(coffee|scss|css|less|hbs|svg|json)$'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.cts', '.mts', '.tsx', '.d.ts'],
    },
    'import/resolver': {
      node: {
        extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx', '.cts', '.mts', '.d.ts'],
      },
    },
    propWrapperFunctions: ['forbidExtraProps', 'exact', 'Object.freeze'],
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
};
