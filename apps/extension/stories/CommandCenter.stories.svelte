<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import CommandCenter from '@/modules/command-center/CommandCenter.svelte'
  import { MockCommandService } from '@/mocks/mock-command-center'

  // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
  const { Story } = defineMeta({
    title: 'CommandCenter',
    component: CommandCenter,
    args: {
      commandService: new MockCommandService()
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