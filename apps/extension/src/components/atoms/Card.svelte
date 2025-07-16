<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  type CardProps = {
    children: Snippet
    nopadding?: boolean
    variant?: 'simple' | 'rectangular' | 'auto'
  } & HTMLAttributes<HTMLElement>

  const { children, nopadding, variant = 'simple', ...props }: CardProps = $props()
</script>

<div
  class={[
    'block bg-white dark:bg-neutral-900 rounded-xl shadow-md overflow-hidden',
    // text
    'text-black dark:text-white',
    // sizing
    variant === 'simple' && 'aspect-square',
    variant === 'rectangular' && 'aspect-2/1',
    variant === 'auto' && 'aspect-auto',
    variant === 'simple' && 'max-w-2xs',
    variant === 'rectangular' && 'max-w-lg',
    variant === 'auto' && 'max-w-full',
    // spacing
    !nopadding && 'p-6',
    props.class
  ]}
  {...props}
>
  {@render children?.()}
</div>

