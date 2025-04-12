<script lang="ts">
  let { open, nopadding = false, children, ...props } = $props()
</script>

<div
  {...props}
  class={[
    open ? 'block' : 'hidden',
    !nopadding && 'p-3',
    "absolute z-10 bottom-full m-2 bg-black/80 text-slate-400 rounded-md shadow-xs",
    props.class
  ]}>
  {@render children()}
</div>
