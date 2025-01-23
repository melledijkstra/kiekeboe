<script lang="ts">
  const { children, ...props } = $props()
</script>

<div
  {...props}
  class="{props.class} z-40 min-w-32 w-fit max-w-96 overflow-hidden rounded-2xl border-2 border-white/20 bg-white/20 p-5 text-white shadow-md backdrop-blur-sm">
  {@render children()}
</div>
