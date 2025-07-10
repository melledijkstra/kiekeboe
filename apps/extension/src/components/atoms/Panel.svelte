<script lang="ts">
  import { Popover } from 'bits-ui'

  type PanelProps = {
    nopadding?: boolean
    nostyling?: boolean
    size?: 'small' | 'medium' | 'large'
  } & Popover.ContentProps

  const { children, nopadding, nostyling, size = 'medium', ...props }: PanelProps = $props()

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
    'z-40',
    // size
    size === 'small' && 'max-w-[300px] max-h-[300px]',
    size === 'medium' && 'w-[500px] h-[400px]',
    size === 'large' && 'w-[600px] h-[500px]',
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