import { dirname, join } from "path"
import type { StorybookConfig } from '@storybook/svelte-vite'

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.stories.@(js|ts|svelte)',
    '../stories/**/*.mdx'
  ],
  addons: [
    "@storybook/addon-svelte-csf",
  ],
  framework: {
    name: getAbsolutePath("@storybook/svelte-vite"),
    options: {}
  }
}
export default config

function getAbsolutePath(value: string): string {
  return dirname(require.resolve(join(value, "package.json")));
}
