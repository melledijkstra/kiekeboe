<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import CommandCenter from '@/modules/command-center/CommandCenter.svelte'
  import { MockCommandService } from '@/mocks/MockCommandService'

  const { Story } = defineMeta({
    title: 'Molecules/CommandCenter',
    component: CommandCenter,
    args: {
      commandService: new MockCommandService()
    }
  })  
</script>

<Story name="Default" args={{ forceOpen: true }} />

<Story name="Without force open" args={{ forceOpen: false }}>
  {#snippet template(args)}
    <p class="text-black dark:text-white">Press <kbd>Ctrl+P</kbd> (or <kbd>Cmd+P</kbd> on Mac) to open the command center.</p>
    <CommandCenter {...args} />
  {/snippet}
</Story>