<script lang="ts">
  import { mdiSpa } from "@mdi/js"
  import Icon from "@/components/Icon.svelte"

  const props = $props()

  function toggleBreathing() {
    if (props.onclick?.()) {
      return
    }
  }
</script>

<button onclick={toggleBreathing} class="text-white cursor-pointer">
  <Icon size={48} path={mdiSpa} />
</button>
