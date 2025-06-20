import type { Preview } from '@storybook/svelte'
import '../src/app.css'
import DarkModeDecarator from './DarkModeDecorator.svelte'

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
  },
  // decorators: [() => DarkModeDecarator]
}

export default preview
