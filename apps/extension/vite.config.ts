import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import tailwindcss from "@tailwindcss/vite";
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import packageJson from './package.json'
import path from 'node:path'

function manifestTransformer(content: string, mode: string) {
  const envVars = loadEnv(mode, process.cwd())
  content = content.replace(
    '%CLIENT_ID%',
    envVars.VITE_GOOGLE_CLIENT_ID
  )
  content = content.replace('%VERSION%', packageJson.version)
  return content
}

const defaultConfig = defineConfig(({ mode }) => ({
  plugins: [
    tailwindcss(),
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
          transform: (content) => manifestTransformer(content, mode)
        }
      ]
    })
  ],
  build: {
    rollupOptions: {
      input: {
        home: './index.html',
        options: './options.html',
        background: './src/background.entry.ts',
        popup: './popup.html',
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'scripts/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash][extname]'
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test-setup.ts'],
  }
}))

export default defaultConfig
