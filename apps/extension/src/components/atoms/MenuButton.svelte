<script lang="ts">
  import { Tooltip } from "bits-ui";
  import IconButton from "./IconButton.svelte"
  import Icon from "./Icon.svelte"

  type MenuButtonProps = {
    mdiIcon: string;
    tooltip?: string;
    onclick?: () => void;
    class?: string | string[];
  };

  const { mdiIcon, tooltip, onclick, ...props }: MenuButtonProps = $props();
</script>
 
<Tooltip.Provider>
  <Tooltip.Root delayDuration={0}>
    <Tooltip.Trigger
      class={[
        props.class,
        'text-white/70 hover:text-white',
        'block cursor-pointer transition-colors',
      ]}
      disabled={!tooltip}
      onclick={onclick}>
      <Icon path={mdiIcon} size={40} />
    </Tooltip.Trigger>
    <Tooltip.Content sideOffset={4}>
      <!-- putting "text-black" in order for arrow to pick it up the color and look the same as content -->
      <Tooltip.Arrow class="text-black/50" />
      <div
        class={[
          // general styles
          'z-10 bg-black/50 text-white text-center py-1 px-2 rounded-md',
          // animation
          // 'opacity-0 transition-opacity', // curently not working
        ]}
      >
        {tooltip}
      </div>
    </Tooltip.Content>
  </Tooltip.Root>
</Tooltip.Provider>