import type { Preview } from '@storybook/svelte'
import '../src/app.css'

export const initialGlobals = {
  backgrounds: {
    grid: true
  }
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  }
}

export default preview
