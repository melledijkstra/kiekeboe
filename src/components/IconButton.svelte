<script lang="ts">
  import Icon from "./Icon.svelte"

  const { icon, ...props } = $props()
</script>

<button
  {...props}
  class="block text-white/70 transition-colors hover:text-white cursor-pointer {props.class}">
  <Icon path={icon} size={48} />
</button>
