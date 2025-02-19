import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  main: {
    build: {
      outDir: 'dist/electron/main',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/main/index.ts')
        },
        external: [
          'electron',
          ...Object.keys(require('./package.json').dependencies || {})
        ]
      },
      watch: {}
    }
  },
  preload: {
    build: {
      outDir: 'dist/electron/preload',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'electron/preload/index.ts')
        },
        external: [
          'electron',
          ...Object.keys(require('./package.json').dependencies || {})
        ],
        output: {
          format: 'cjs',
          entryFileNames: '[name].js'
        }
      },
      watch: {}
    }
  },
  renderer: {
    root: '.',
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'index.html')
        },
        external: ['@mdx-js/mdx', '@types/estree', '@types/estree-jsx']
      },
      watch: {}
    },
    resolve: {
      alias: {
        '@mdx-js/mdx': resolve(__dirname, 'node_modules/@mdx-js/mdx'),
        '@types/estree': resolve(__dirname, 'node_modules/@types/estree'),
        '@types/estree-jsx': resolve(__dirname, 'node_modules/@types/estree-jsx'),
        '@types/mdx': resolve(__dirname, 'node_modules/@types/mdx')
      }
    },
    plugins: [react()]
  }
}) 