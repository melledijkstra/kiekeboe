import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import packageJson from './package.json'
import path from 'node:path'

function manifestTransformer(content: string, mode: string) {
  const envVars = loadEnv(mode, process.cwd())
  content = content.replace(
    '%CLIENT_ID%',
    envVars.VITE_GOOGLE_EXTENSION_CLIENT_ID
  )
  content = content.replace('%VERSION%', packageJson.version)
  return content
}

const defaultConfig = defineConfig(({ mode }) => ({
  plugins: [
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
        background: './src/background.ts',
        test: './testing.html'
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
  }
}))

export default defaultConfig
