import { loadEnv } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default ({ mode }) => ({
  plugins: [
    svelte(),
    viteStaticCopy({
      targets: [
        {
          src: 'manifest.json',
          dest: '.',
          transform: (content) => {
            const envVars = loadEnv(mode, process.cwd(), '');
            content = content.replace('%CLIENT_ID%', envVars.CLIENT_ID);
            return content;
          }
        }
      ]
    })
  ]
})