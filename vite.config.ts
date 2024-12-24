import { defineConfig, loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import packageJson from './package.json'

export default defineConfig(({ mode }) =>
  defineConfig({
    plugins: [
      svelte(),
      viteStaticCopy({
        targets: [
          {
            src: 'manifest.json',
            dest: '.',
            transform: (content) => {
              const envVars = loadEnv(mode, process.cwd(), '')
              content = content.replace('%CLIENT_ID%', envVars.CLIENT_ID)
              content = content.replace('%VERSION%', packageJson.version)
              return content
            }
          }
        ]
      })
    ],
    build: {
      rollupOptions: {
        input: {
          home: './index.html',
          options: './options.html'
        },
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: 'scripts/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash][extname]'
        }
      }
    }
  })
)
