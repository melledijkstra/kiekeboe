<script lang="ts">
  import { Popover } from 'bits-ui'

  type PanelProps = {
    nopadding?: boolean
    nostyling?: boolean
  } & Popover.ContentProps

  const { children, nopadding, nostyling, ...props }: PanelProps = $props()

  if (!children) {
    throw new Error('Panel component requires children')
  }
</script>

<Popover.Content
  sideOffset={8}
  collisionPadding={8}
  {...props}
  class={[
    'rounded-xl shadow-md backdrop-blur-xs',
    'max-h-[600px] max-w-[900px] z-40',
    !nopadding && 'p-4',
    // dark theme
    !nostyling && 'dark:bg-black/60 dark:text-white',
    // light theme
    !nostyling && 'bg-white/40 text-black',
    props.class
  ]}
>
  <Popover.Arrow class={[
    // align with panel background
    "dark:text-black/40 text-white/40"
  ]} />
    {@render children()}
</Popover.Content>