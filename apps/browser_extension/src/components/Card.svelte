<script lang="ts">
  type CardProps = {
    theme?: 'light' | 'dark'
    nopadding?: boolean
    [key: string]: any
  }

  const {
    children,
    theme = 'dark',
    nopadding = false,
    ...props
  }: CardProps = $props()
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
