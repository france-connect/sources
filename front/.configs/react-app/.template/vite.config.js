import { defineConfig, mergeConfig } from 'vite';

import defaultConfig from '@fc/react-app/vite.config';

// eslint-disable-next-line import/no-default-export
export default defineConfig(() => {
  const config = mergeConfig(defaultConfig, {});
  return config;
});
