// @NOTE unable to get it resolved into this file
// eslint-disable-next-line import/no-unresolved
import { defineConfig, globalIgnores } from 'eslint/config';

import { baseConfig } from './configs/base.mjs';
import { deprecatedConfig } from './configs/deprecated.mjs';
import { jestConfig } from './configs/jest.mjs';
import { jsxConfig } from './configs/jsx.mjs';
import { legacyConfig } from './configs/legacy.mjs';
import { typescriptConfig } from './configs/typescript.mjs';

// @NOTE Config file
// eslint-disable-next-line import/no-default-export
export default defineConfig([
  globalIgnores([
    '**/.template',
    '**/tmp/*',
    '**/temp/*',
    '**/dist/*',
    '**/build/*',
    '**/public/*',
    '**/scripts/*',
    '**/coverage/*',
    '**/node_modules/*',
    '**/__fixtures__*',
    '**/__snapshots__/*',
    '**/*.css',
    '**/*.scss',
  ]),
  baseConfig,
  typescriptConfig,
  jsxConfig,
  jestConfig,
  legacyConfig,
  deprecatedConfig,
]);
