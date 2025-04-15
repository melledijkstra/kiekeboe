<script lang="ts">
  import type { HTMLAttributes } from 'svelte/elements'

  type PanelProps = {
    theme?: 'light' | 'dark'
    nopadding?: boolean
  } & HTMLAttributes<HTMLDivElement>

  const {
    children,
    theme = 'dark',
    nopadding = false,
    ...props
  }: PanelProps = $props()

  if (!children) {
    throw new Error('Panel component requires children')
  }
</script>

<div
  {...props}
  class={[
    props.class,
    !nopadding && 'p-3',
    theme === 'dark' && 'bg-black/40 text-white',
    theme === 'light' && 'bg-white/40 text-black',
    'z-40 rounded-xl shadow-md backdrop-blur-xs'
  ]}
>
  {@render children()}
</div>
