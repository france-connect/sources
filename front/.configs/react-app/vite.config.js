import path from 'path';

import react from '@vitejs/plugin-react';
import url from 'url';
import { splitVendorChunkPlugin } from 'vite';
import checker from 'vite-plugin-checker';
import removeConsole from 'vite-plugin-remove-console';
import sassDts from 'vite-plugin-sass-dts';
import tsconfigPaths from 'vite-tsconfig-paths';

/* ------------------------------------------------------
 *
 * VITE main config file
 * @see : https://vitejs.dev/config/
 *
 ------------------------------------------------------ */
const fileDirname = path.dirname(url.fileURLToPath(import.meta.url));

// @NOTE Configuration file
// eslint-disable-next-line import/no-default-export
export default {
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths({
      // @NOTE resolve node_modules @fc
      projects: [path.join(fileDirname, '..', '..', 'tsconfig.json')],
    }),
    react(),
    // @NOTE sassDts : check about global.d.ts config
    sassDts(),
    checker({
      eslint: false,
      stylelint: false,
      typescript: true,
    }),
    // @NOTE remove console.xxx during a production build
    removeConsole(),
    // @NOTE split vendors packages into a specific chunk file
    splitVendorChunkPlugin(),
  ],
  server: {
    allowedHosts: true,
    clearScreen: true,
    port: 3000,
    strictPort: true,
  },
};
