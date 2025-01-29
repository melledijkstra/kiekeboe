<script lang="ts">
  import Icon from "./Icon.svelte"

  const { icon, children = null, ...props } = $props()
</script>

<button
  {...props}
  class={[
    props.class,
    "block text-white/70 transition-colors hover:text-white cursor-pointer"
  ]}>
  <Icon path={icon} size={!children ? 48 : 24} />
  {@render children?.()}
</button>
