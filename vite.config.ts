import { loadEnv } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default ({ mode }) => ({
  plugins: [
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