import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export const jsxConfig = [
  {
    extends: [
      reactPlugin.configs.flat.recommended,
      reactPlugin.configs.flat['jsx-runtime'],
      reactHooksPlugin.configs['recommended-latest'],
      jsxA11yPlugin.flatConfigs.recommended,
    ],
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'react-hooks/exhaustive-deps': 2,
      'react-hooks/rules-of-hooks': 2,
      'react/display-name': [2, { ignoreTranspilerName: false }],
      'react/jsx-key': 2,
      'react/jsx-props-no-spreading': [
        2,
        {
          custom: 'enforce',
          exceptions: ['input', 'select', 'textarea'],
          explicitSpread: 'ignore',
          html: 'enforce',
        },
      ],
      'react/jsx-sort-props': [
        2,
        {
          callbacksLast: true,
          ignoreCase: true,
          locale: 'auto',
          multiline: 'ignore',
          noSortAlphabetically: false,
          reservedFirst: true,
          shorthandFirst: true,
        },
      ],
      'react/no-unstable-nested-components': 2,
      'react/react-in-jsx-scope': 0,
    },
  },
];
