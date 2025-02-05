<script lang="ts">
  const { children, nopadding = false, ...props } = $props()
</script>

<div
  {...props}
  class={[
    props.class,
    !nopadding && 'p-5',
    'z-40 w-fit overflow-hidden rounded-2xl border-2 border-white/20 bg-white/20 text-white shadow-md backdrop-blur-xs'
  ]}
>
  {@render children()}
</div>
