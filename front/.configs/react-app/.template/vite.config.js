import { defineConfig, mergeConfig } from 'vite';

import defaultConfig from '@fc/react-app/vite.config';

export default defineConfig(() => {
  const config = mergeConfig(defaultConfig, {});
  return config;
});
