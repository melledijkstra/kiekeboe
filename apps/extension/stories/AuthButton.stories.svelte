<script module lang="ts">
  import { defineMeta, setTemplate } from '@storybook/addon-svelte-csf'
  import AuthButton from '@/components/AuthButton.svelte'
  import { fn } from '@storybook/test'
  import type { OauthProvider } from '@/oauth2/auth'

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

<script>
  setTemplate(template)
</script>

{#snippet template({
  children,
  provider,
  ...args
}: {
  children?: string
  provider?: OauthProvider
})}
  {#if !provider}
    <p>Auth provider needs to be specified</p>
  {:else if children}
    <AuthButton {provider} {...args}>{children}</AuthButton>
  {:else}
    <AuthButton {provider} {...args} />
  {/if}
{/snippet}

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Google" args={{ provider: 'google' }} />

<Story name="Fitbit" args={{ provider: 'fitbit' }} />

<Story name="Spotify" args={{ provider: 'spotify' }} />
