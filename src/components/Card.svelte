<script lang="ts">
  const { children, ...props } = $props()
</script>

<div
  {...props}
  class="{props.class} min-w-80 w-fit max-w-96 overflow-hidden rounded-xl border-b-2 border-t-2 border-white/20 bg-neutral-400/50 p-5 text-white shadow-md">
  {@render children()}
</div>
