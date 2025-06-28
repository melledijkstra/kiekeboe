<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import CommandCenter from '@/modules/command-center/CommandCenter.svelte'
  import { fn } from '@storybook/test'
  import type { CommandServiceInterface } from '@/modules/command-center/CommandServiceInterface'
  import type { CommandGroups } from '@/modules/command-center/types'
  import { mdiTestTube } from '@mdi/js'

  class mockCommandService implements CommandServiceInterface {
    get commands(): CommandGroups {
      return {
        Actions: [{
          name: 'Mock Command',
          keywords: ['mock', 'command'],
          icon: mdiTestTube,
          action: (input?: string) => {
            console.log(`Mock command executed with input: ${input}`)
          }
        }],
        Bookmarks: []
      }
    }

    initialize() {
      // Mock initialization logic
    }

    execute(input: string) {
      console.log(`Executing command for input: ${input}`)
      fn()
    }
  }

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'CommandCenter',
    component: CommandCenter,
    args: {
      commandService: new mockCommandService()
    }
  })

  
</script>

<!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
<Story name="Default" args={{ forceOpen: true }} />

<Story name="Without force open" args={{ forceOpen: false }}>
  {#snippet template(args)}
    <p>Press <kbd>Ctrl+P</kbd> (or <kbd>Cmd+P</kbd> on Mac) to open the command center.</p>
    <CommandCenter {...args} />
  {/snippet}
</Story>