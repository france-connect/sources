import path from 'path';

import react from '@vitejs/plugin-react';
import url from 'url';
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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // @NOTE code splitting : https://rollupjs.org/guide/en/#outputmanualchunks
          // Split vendor packages into a separate chunk
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
    sourcemap: true,
  },
  plugins: [
    tsconfigPaths({
      // @NOTE resolve node_modules @fc
      projects: [path.join(fileDirname, '..', '..', 'tsconfig.json')],
    }),
    react(),
    // @NOTE sassDts : check about global.d.ts config
    sassDts({ legacyFileFormat: false }),
    checker({
      eslint: false,
      stylelint: false,
      typescript: true,
    }),
    // @NOTE remove console.xxx during a production build
    removeConsole(),
  ],
  server: {
    allowedHosts: true,
    clearScreen: true,
    port: 3000,
    strictPort: true,
  },
};
