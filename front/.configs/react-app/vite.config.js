/* ------------------------------------------------------
 *
 * VITE main config file
 * @see : https://vitejs.dev/config/
 *
 ------------------------------------------------------ */

import react from '@vitejs/plugin-react';
import { splitVendorChunkPlugin } from 'vite';
import removeConsole from 'vite-plugin-remove-console';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import checker from 'vite-plugin-checker';
import path from 'path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const _dirname =
  typeof __dirname !== 'undefined' ? __dirname : dirname(fileURLToPath(import.meta.url));

export default {
  build: {
    outDir: 'build',
    sourcemap: false,
  },
  plugins: [
    tsconfigPaths({
      // @NOTE resolve node_modules @fc
      projects: [path.join(_dirname, '..', '..', 'tsconfig.json')],
    }),
    react(),
    // @NOTE sassDts : check about global.d.ts config
    sassDts(),
    checker({
      typescript: true,
      eslint: false,
      stylelint: false,
    }),
    // @NOTE remove console.xxx during a production build
    removeConsole(),
    // @NOTE split vendors packages into a specific chunk file
    splitVendorChunkPlugin(),
  ],
  server: {
    clearScreen: true,
    port: 3000,
    strictPort: true,
  },
};
