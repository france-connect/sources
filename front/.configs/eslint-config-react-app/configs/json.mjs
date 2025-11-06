import json from '@eslint/json';

export const jsonConfig = [
  {
    files: ['**/*.json'],
    rules: { '@typescript-eslint/no-unused-expressions': 0 },
  },
  {
    extends: [json.configs.recommended],
    files: ['**/i18n/en.json', '**/i18n/fr.json', '**/__fixtures__/i18n.fr.json'],
    ignores: ['**/*.json', '!**/i18n/en.json', '!**/i18n/fr.json', '!**/__fixtures__/i18n.fr.json'],
    language: 'json/json',
    rules: { 'json/sort-keys': 2 },
  },
];
