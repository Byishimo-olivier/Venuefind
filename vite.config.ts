import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

const esToolkitCompatAliases = [
  'get',
  'isPlainObject',
  'last',
  'maxBy',
  'minBy',
  'omit',
  'range',
  'sortBy',
  'sumBy',
  'throttle',
  'uniqBy',
].map((name) => ({
  find: `es-toolkit/compat/${name}`,
  replacement: fileURLToPath(new URL(`./src/vendor/es-toolkit-compat/${name}.ts`, import.meta.url)),
}))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      ...esToolkitCompatAliases,
      {
        find: /^use-sync-external-store\/with-selector(\.js)?$/,
        replacement: fileURLToPath(new URL('./src/vendor/use-sync-external-store/with-selector.ts', import.meta.url)),
      },
      {
        find: /^use-sync-external-store\/shim\/with-selector(\.js)?$/,
        replacement: fileURLToPath(new URL('./src/vendor/use-sync-external-store/with-selector.ts', import.meta.url)),
      },
      {
        find: /^decimal\.js-light$/,
        replacement: fileURLToPath(new URL('./node_modules/decimal.js-light/decimal.mjs', import.meta.url)),
      },
      {
        find: /^eventemitter3(\/index\.js)?$/,
        replacement: fileURLToPath(new URL('./node_modules/eventemitter3/dist/eventemitter3.esm.js', import.meta.url)),
      },
      {
        find: /^react-is$/,
        replacement: fileURLToPath(new URL('./src/vendor/react-is.ts', import.meta.url)),
      },
    ],
  },
  optimizeDeps: {
    exclude: ['recharts', 'es-toolkit', 'use-sync-external-store'],
  },
})
