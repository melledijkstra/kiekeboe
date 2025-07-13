<script lang="ts">
  import { Popover } from 'bits-ui'
  import Panel from './Panel.svelte'

  type PanelProps = {
    nopadding?: boolean
    nostyling?: boolean
    size?: 'small' | 'medium' | 'large'
  } & Popover.ContentProps

  const { children, ...props }: PanelProps = $props()

  if (!children) {
    throw new Error('Panel component requires children')
  }
</script>

<Popover.Content
  sideOffset={8}
  collisionPadding={8}
  {...props}
>
  {#snippet child({ wrapperProps, props, open })}
    {#if open}
      <div {...wrapperProps}>
        <Popover.Arrow class={[
          // align with panel background
          "dark:text-black/40 text-white/40"
        ]} />
        <Panel {...props}>
          {@render children()}
        </Panel>
      </div>
    {/if}
  {/snippet}
</Popover.Content>