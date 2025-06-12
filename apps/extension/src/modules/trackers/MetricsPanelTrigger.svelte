<script lang="ts">
  import { clickOutside } from "@/actions/click-outside"
  import IconButton from "@/components/atoms/IconButton.svelte"
  import { mdiPlus } from "@mdi/js"

  const { children, isOpen, onOpen, onClose }: {
    children: () => any,
    isOpen?: boolean,
    onOpen?: () => void,
    onClose?: () => void
  } = $props()
</script>

<div class="relative">
  <IconButton
    icon={mdiPlus}
    class={[
      isOpen ? 'opacity-100' : 'opacity-0',
      'group-hover:opacity-100 transition-opacity duration-300 p-1 flex-col cursor-pointer'
    ]}
    onclick={() => isOpen ? onClose?.() : onOpen?.()}
  >
    <span>Add</span>
  </IconButton>
  {@render children()}
</div>