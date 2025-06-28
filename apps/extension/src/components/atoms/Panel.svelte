<script lang="ts">
  import { Popover } from 'bits-ui'

  type PanelProps = {
    nopadding?: boolean
  } & Popover.ContentProps

  const { children, nopadding, ...props }: PanelProps = $props()

  if (!children) {
    throw new Error('Panel component requires children')
  }
</script>

<Popover.Content
  sideOffset={8}
  collisionPadding={8}
  {...props}
  class={[
    !nopadding && 'p-4',
    'rounded-xl shadow-md backdrop-blur-xs',
    // dark theme
    'dark:bg-black/60 dark:text-white',
    // light theme
    'bg-white/40 text-black',
    'max-h-[600px] max-w-[900px] z-40',
    props.class
  ]}
>
  <Popover.Arrow class={[
    // align with panel background
    "dark:text-black/40 text-white/40"
  ]} />
  <div class="overflow-y-auto h-full">
    {@render children()}
  </div>
</Popover.Content>