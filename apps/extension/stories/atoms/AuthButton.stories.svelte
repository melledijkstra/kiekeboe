<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import AuthButton from '@/components/AuthButton.svelte'
  import { fn } from 'storybook/test'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'Atoms/Buttons/Auth',
    component: AuthButton,
    argTypes: {
      children: {
        control: {
          type: 'text'
        }
      },
      provider: {
        control: {
          type: 'select',
          options: ['google', 'github', 'fitbit']
        }
      }
    },
    args: {
      onclick: fn()
    }
  })
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Google" args={{ provider: 'google' }} />

<Story name="Fitbit" args={{ provider: 'fitbit' }} />

<Story name="Spotify" args={{ provider: 'spotify' }} />
