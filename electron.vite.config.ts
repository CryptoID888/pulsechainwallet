import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import * as path from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from 'tailwindcss'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import topLevelAwait from 'vite-plugin-top-level-await'
// import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import wasm from 'vite-plugin-wasm'
// import cjsImport from 'rollup-plugin-cjs-import';

// import topLevelAwaitWorker from 'vite-plugin-top-level-await-worker'

Error.stackTraceLimit = Infinity

export default defineConfig({
  main: {
    build: {
      watch: {
        include: ['src/main/**/*'],
      },
      rollupOptions: {
        preserveEntrySignatures: 'strict',
        input: {
          index: path.resolve(__dirname, 'src', 'main', 'index.ts'),
          worker: path.resolve(__dirname, 'src', 'main', 'worker.ts'),
        },
        external: ['url', 'brotli-wasm', 'viem', 'viem/chains'],
      },
    },
    plugins: [
      externalizeDepsPlugin({
        include: ['brotli-wasm'],
      }),
      wasm(),
    ],
    resolve: {
      alias: {
        '$common': path.resolve(__dirname, 'src', 'common'),
        '$main': path.resolve(__dirname, 'src', 'main'),
        '$preload': path.resolve(__dirname, 'src', 'preload'),
        '$root': path.resolve(__dirname),
      },
    },
  },
  preload: {
    build: {
      watch: {
        include: ['src/preload/**/*'],
      },
    },
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '$common': path.resolve(__dirname, 'src', 'common'),
      },
    },
  },
  renderer: {
    build: {
      watch: {
        include: ['src/**/*'],
      },
    },
    resolve: {
      alias: {
        '$common': path.resolve(__dirname, 'src', 'common'),
        '$preload': path.resolve(__dirname, 'src', 'preload'),
      },
    },
    plugins: [
      nodePolyfills({
        globals: {
          Buffer: true, // can also be 'build', 'dev', or false
          global: true,
          process: true,
        },
      }),
      tsconfigPaths(),
      svelte(),
      topLevelAwait(),
    ],
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
  },
})
