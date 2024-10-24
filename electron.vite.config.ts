import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import * as path from 'path'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tailwindcss from 'tailwindcss'
import tsconfigPaths from 'vite-tsconfig-paths'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import topLevelAwait from 'vite-plugin-top-level-await'
// import commonjs from '@rollup/plugin-commonjs'
// import wasm from 'vite-plugin-wasm'

export default defineConfig({
  main: {
    build: {
      watch: {
        include: ['src/main/**/*'],
      },
    },
    plugins: [
      externalizeDepsPlugin(),
    ],
    resolve: {
      alias: {
        '$common': path.resolve(__dirname, 'src/common'),
        '$main': path.resolve(__dirname, 'src/main'),
        '$preload': path.resolve(__dirname, 'src/preload'),
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
        '$common': path.resolve(__dirname, 'src/common'),
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
        '$common': path.resolve(__dirname, 'src/common'),
        '$preload': path.resolve(__dirname, 'src/preload'),
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
    // optimizeDeps: {
    //   exclude: ['brotli-wasm'],
    // },
  },
})
